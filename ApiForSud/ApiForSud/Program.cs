using ApiForSud.Data;
using ApiForSud.Services.AuthService;
using ApiForSud.Services.CaseService;
using ApiForSud.Services.CurtInstanceService;
using ApiForSud.Services.PasswordService;
using ApiForSud.Services.TokenService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;


namespace ApiForSud
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthorization();
            builder.Services.AddOpenApi();
            builder.Services.AddControllers();

            //��������������
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).
                AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["AppSettings:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["AppSettings:Audience"],
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!))
                    };

                });

            //��� �������
            builder.Services.AddScoped<IPasswordService, PasswordService>();
            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ICaseService, CaseService>();
            builder.Services.AddScoped<ICurtInstanceService, CurtInstanceService>();

            builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
                });
                });


            //��
            builder.Services.AddDbContext<ApplicationDBContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("MydefaultConnection"));
            });
            builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(7080); // только HTTP
});

            var app = builder.Build();

            app.UseCors("AllowAll");
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapOpenApi();
            app.MapScalarApiReference();
            app.MapControllers();


            app.Run();
        }
    }
}
