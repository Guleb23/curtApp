namespace ApiForSud.DTOs
{
    public class CaseResponseDTO
    {
        public Guid Id { get; set; }
        public string NomerOfCase { get; set; } = string.Empty;
        public string NameOfCurt { get; set; } = string.Empty;
        public string Applicant { get; set; } = string.Empty;
        public string Defendant { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public DateTime? DateOfCurt { get; set; }
        public string ResultOfCurt { get; set; } = string.Empty;
        public DateTime? DateOfResult { get; set; }
        public bool IsMarkeredByAdmin { get; set; }

        public bool IsUnMarkeredByAdmin { get; set; }
        public List<CurtInstanceResponseDTO> CurtInstances { get; set; } = new();
    }
}



