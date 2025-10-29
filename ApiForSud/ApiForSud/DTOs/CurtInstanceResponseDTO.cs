namespace ApiForSud.DTOs
{
    public class CurtInstanceResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NameOfCurt { get; set; } = string.Empty;
        public DateTime? DateOfSession { get; set; }
        public string Link { get; set; } = string.Empty;
        public string Employee { get; set; } = string.Empty;
        public string ResultOfIstance { get; set; } = string.Empty;
        public DateTime? DateOfResult { get; set; }
    }
}
