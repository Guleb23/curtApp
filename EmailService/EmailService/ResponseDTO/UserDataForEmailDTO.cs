namespace EmailService.ResponseDTO
{
    public class UserDataForEmailDTO
    {
        public string Email { get; set; }

        public List<string> OverdueCasesId { get; set; }
    }
}
