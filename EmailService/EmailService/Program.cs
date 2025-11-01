
using EmailService.Services;
using Scalar.AspNetCore;

namespace EmailService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddOpenApi();
            builder.Services.AddScoped<IEmailService, EmailServiceSender>();

            builder.Services.AddControllers();

            var app = builder.Build();


                app.MapScalarApiReference();
                app.MapOpenApi();

            app.MapControllers();
            app.Run();
        }
    }
}
