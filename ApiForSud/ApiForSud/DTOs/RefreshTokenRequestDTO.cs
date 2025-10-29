namespace ApiForSud.DTOs
{
    public class RefreshTokenRequestDTO
    {
        public Guid UserId { get; set; }

        public string RefreshToken { get; set; }

    }
}
