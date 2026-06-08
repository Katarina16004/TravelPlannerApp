using MailKit.Net.Smtp;
using MimeKit;

namespace EmailService
{
    public static class SmtpMailer
    {
        public static async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            string smtpServer = "smtp.gmail.com";
            int smtpPort = 587;
            string senderEmail = "veljkovickatarina56@gmail.com";
            string senderPassword = "rzrwayyubsfhbjrz";
            string senderName = "Travel Planner App";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress(string.Empty, toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder();

            try
            {
                string searchString = "base64,";
                int startIndex = htmlBody.IndexOf(searchString);

                if (startIndex != -1)
                {
                    startIndex += searchString.Length;
                    int endIndex = htmlBody.IndexOf("'", startIndex);
                    if (endIndex == -1) endIndex = htmlBody.IndexOf("\"", startIndex);

                    string base64Data = htmlBody.Substring(startIndex, endIndex - startIndex);
                    byte[] imageBytes = Convert.FromBase64String(base64Data);

                    var image = bodyBuilder.LinkedResources.Add("qrcode.png", imageBytes);
                    image.ContentId = MimeKit.Utils.MimeUtils.GenerateMessageId();

                    string oldSrc = htmlBody.Substring(htmlBody.IndexOf("data:image"), endIndex - htmlBody.IndexOf("data:image"));
                    htmlBody = htmlBody.Replace(oldSrc, $"cid:{image.ContentId}");
                }
            }
            catch
            {
            }

            bodyBuilder.HtmlBody = htmlBody;
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(senderEmail, senderPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}