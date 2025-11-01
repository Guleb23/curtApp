
using BackGroundService.Models;
using Microsoft.EntityFrameworkCore;

namespace BackGroundService
{
    internal class ApplicationDBContext: DbContext
    {

        public DbSet<CaseModel> Cases { get; set; }
        public DbSet<UserModel> Users { get; set; }

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {
            
        }

    }
}
