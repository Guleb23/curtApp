namespace ApiForSud.DTOs
{
    public class UserDTO
    {
        public string Login { get; set; }
        public string? FIO { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public int RoleId { get; set; }
    }
}
