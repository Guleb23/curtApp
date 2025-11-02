using EmailService.ResponseDTO;
using MailKit.Net.Smtp;
using MimeKit;
using System.Net.Sockets;
using System.Net;
using MailKit.Security;

namespace EmailService.Services
{
    public class EmailServiceSender : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailServiceSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(List<UserDataForEmailDTO> usersData)
        {
            if (usersData == null || !usersData.Any())
                return false;

            string psw = _configuration["smtpConfig:psw"]!;
            string login = _configuration["smtpConfig:login"]!;
            string connection = _configuration["smtpConfig:smtpConnection"]!;

            Console.WriteLine($"=== SMTP Configuration ===");
            Console.WriteLine($"Login: {login}");
            Console.WriteLine($"Connection: {connection}");
            Console.WriteLine($"Password length: {psw?.Length}");
            Console.WriteLine($"Users to send: {usersData.Count}");

            bool allSent = true;

            using var smtpClient = new SmtpClient();

            try
            {
                Console.WriteLine($"Attempting to connect to {connection}:587...");

                // Добавьте timeout
                smtpClient.Timeout = 30000;

                await smtpClient.ConnectAsync(connection, 587, MailKit.Security.SecureSocketOptions.StartTls);
                Console.WriteLine("Connected successfully!");

                Console.WriteLine("Attempting authentication...");
                await smtpClient.AuthenticateAsync(login, psw);
                Console.WriteLine("Authenticated successfully!");

                foreach (var data in usersData)
                {
                    if (data?.Email == null || data.OverdueCasesId == null || !data.OverdueCasesId.Any())
                        continue;

                    string message = $"По вашим делам №{string.Join(", ", data.OverdueCasesId)} приближается срок 30 дней";
                    var email = new MimeMessage();
                    email.From.Add(MailboxAddress.Parse(login));
                    email.To.Add(MailboxAddress.Parse(data.Email));
                    email.Subject = "Срочная информация по судебным делам";
                    email.Body = new TextPart(MimeKit.Text.TextFormat.Text)
                    {
                        Text = message
                    };

                    try
                    {
                        Console.WriteLine($"Sending email to {data.Email}...");
                        await smtpClient.SendAsync(email);
                        Console.WriteLine($"Email sent successfully to {data.Email}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Ошибка отправки email пользователю {data.Email}: {ex.Message}");
                        Console.WriteLine($"Stack trace: {ex.StackTrace}");
                        allSent = false;
                    }
                }

                await smtpClient.DisconnectAsync(true);
                Console.WriteLine("Disconnected from SMTP server");
            }
            catch (AuthenticationException authEx)
            {
                Console.WriteLine($"AUTHENTICATION ERROR: {authEx.Message}");
                return false;
            }
            catch (SmtpCommandException smtpEx)
            {
                Console.WriteLine($"SMTP COMMAND ERROR: {smtpEx.Message}");
                Console.WriteLine($"Status Code: {smtpEx.StatusCode}");
                return false;
            }
            catch (SmtpProtocolException protoEx)
            {
                Console.WriteLine($"SMTP PROTOCOL ERROR: {protoEx.Message}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GENERAL ERROR: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return false;
            }

            return allSent;
        }
    }
}
