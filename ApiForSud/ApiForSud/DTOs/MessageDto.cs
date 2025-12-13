using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.DTOs
{
    public class MessageDto
    {
        public bool Status { get; set; }

        public string Message { get; set; }

        public User User { get; set; } = null;
    }
}
