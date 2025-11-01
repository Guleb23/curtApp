using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Models
{
    internal class UserModel
    {
        public Guid Id { get; set; }
        public string? Login { get; set; }

        public string? PasswordHash { get; set; }

        public string? Email { get; set; }

        public int RoleId { get; set; }

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
