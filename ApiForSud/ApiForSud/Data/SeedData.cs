using ApiForSud.Models.DatabaseModels;
using ApiForSud.Services.PasswordService;

namespace ApiForSud.Data
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDBContext context, IPasswordService passwordService)
        {
            if (context.Users.Any())
            {
                return;
            }

            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                FIO = "Администратор Системы",
                Login = "Admin123",
                PasswordHash = passwordService.HashPassword("Admin123!"),
                Email = "admin@system.com",
                RoleId = 2
            };

            context.Users.Add(adminUser);
            context.SaveChanges();
        }
    }
}


