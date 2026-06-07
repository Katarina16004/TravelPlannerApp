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

            message.Body = new TextPart("html")
            {
                Text = htmlBody
            };

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