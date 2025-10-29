using ApiForSud.Models.DatabaseModels;
using Microsoft.EntityFrameworkCore;

namespace ApiForSud.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "User" },
                new Role { Id = 2, Name = "Admin" }
                );

            modelBuilder.Entity<Case>()
                 .HasOne(c => c.User)
                 .WithMany(u => u.UserCases)
                 .HasForeignKey(c => c.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CurtInstance>()
                .HasOne(ci => ci.Case)
                .WithMany(c => c.CurtInstances)
                .HasForeignKey(ci => ci.CaseId)
                .OnDelete(DeleteBehavior.Cascade);

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<CurtInstance> CurtInstances { get; set; }


    }
}


