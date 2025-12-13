using ApiForSud.Data;
using ApiForSud.Services.AuthService;
using ApiForSud.Services.CaseService;
using ApiForSud.Services.CurtInstanceService;
using ApiForSud.Services.DirectorService;
using ApiForSud.Services.PasswordService;
using ApiForSud.Services.PdfService;
using ApiForSud.Services.ReportService;
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
            builder.Services.AddScoped<IAdminService, AdminService>();
            builder.Services.AddScoped<IReportService, ReportService>();
            builder.Services.AddScoped<IPdfService, PdfService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.WithOrigins(
                        "http://frontend:5173",
                        "http://nginx_proxy:80",
                        "http://nginx_proxy",
                        "http://localhost:5080",
                        "http://localhost:5173",
                        "https://localhost:5080",
                        "http://client_c:5173",
                        "http://127.0.0.1:5080",
                        "http://127.0.0.1:5173"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithExposedHeaders("Content-Disposition");
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

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDBContext>();
                    var passwordService = services.GetRequiredService<IPasswordService>();
                    context.Database.Migrate();
                    SeedData.Initialize(context, passwordService);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }

            app.UseCors("AllowAll");
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapOpenApi();
            app.MapScalarApiReference("/docs");
            app.MapControllers();


            app.Run();
        }
    }
}
