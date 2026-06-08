using System.Fabric;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime; 

using Common.Interfaces;
using Common.Events;

namespace EmailService
{
    internal sealed class EmailService : StatefulService, IEmailService
    {
        private const string QueueName = "emailEventQueue";

        public EmailService(StatefulServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();
        }

        public async Task PublishEvent(EmailEvent emailEvent)
        {
            if (emailEvent == null) return;

            var queue = await this.StateManager.GetOrAddAsync<IReliableQueue<EmailEvent>>(QueueName);

            using (var tx = this.StateManager.CreateTransaction())
            {
                await queue.EnqueueAsync(tx, emailEvent);
                await tx.CommitAsync();
            }
        }

        /// <summary>
        /// worker koji osluskuje red cekanja i salje mejlove
        /// </summary>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            var queue = await this.StateManager.GetOrAddAsync<IReliableQueue<EmailEvent>>(QueueName);

            while (!cancellationToken.IsCancellationRequested)
            {
                using (var tx = this.StateManager.CreateTransaction())
                {
                    var result = await queue.TryDequeueAsync(tx);

                    if (result.HasValue)
                    {
                        var emailEvent = result.Value;

                        try
                        {
                            await ExecuteEmailSendingAsync(emailEvent);
                            await tx.CommitAsync();
                        }
                        catch (Exception ex)
                        {
                            ServiceEventSource.Current.ServiceMessage(this.Context, $"Error with email for event {emailEvent.Email}: {ex.Message}");
                        }
                    }
                    else
                    {
                        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
                    }
                }
            }
        }

        private async Task ExecuteEmailSendingAsync(EmailEvent emailEvent)
        {
            if (emailEvent.TripShareDto != null)
            {
                string htmlBody = GenerateTripShareHtml(emailEvent.TripShareDto);
                string subject = "Trip share!";

                try
                {
                    await SmtpMailer.SendEmailAsync(emailEvent.Email, subject, htmlBody);
                }
                catch (Exception ex)
                {
                    ServiceEventSource.Current.ServiceMessage(
                        this.Context,
                        $"SMTP FAILED: {ex.ToString()}");
                    Console.WriteLine($"SMTP FAILED: {ex.ToString()}");

                    if (ex.InnerException != null)
                    {
                        ServiceEventSource.Current.ServiceMessage(
                            this.Context,
                            $"INNER: {ex.InnerException.ToString()}");
                    }
                }
            }
        }
        private string GenerateTripShareHtml(Common.DTOs.Trip.TripShare.TripShareDto shareDto)
        {
            var accessText = shareDto.AccessType == Common.Enums.ShareAccessType.View ? "View" : "Edit";

            return $@"
            <html>
            <body style='font-family: Arial, sans-serif; padding: 20px;'>
                <div style='max-width: 500px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; text-align: center;'>
                    <h2>This trip is shared with you</h2>
                    <p>You have access to the trip. Type of access: <strong>{accessText}</strong></p>
                    <div style='margin: 20px;'>
                       <img src='data:image/png;base64,{shareDto.QrCodeBase64}' alt='QR Code' style='padding: 10px; border: 1px solid #ddd; width: 200px; height: 200px;' />
                    </div>
                    <p style='font-size: 12px; color: #888;'>This share expires in: {shareDto.ExpiresAt:dd.MM.yyyy u HH:mm} UTC</p>
                </div>
            </body>
            </html>";
        }
    }
}