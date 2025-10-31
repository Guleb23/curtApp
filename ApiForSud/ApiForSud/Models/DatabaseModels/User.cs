namespace ApiForSud.Models.DatabaseModels
{
    public class User
    {
        public Guid Id { get; set; }
        public string? Login { get; set; }

        public string? PasswordHash { get; set; }

        public string? Email { get; set; }

        public int RoleId { get; set; }

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiryTime { get; set; }

        public virtual ICollection<Case> UserCases { get; set; } = new List<Case>();
    }
}
