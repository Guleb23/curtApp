namespace ApiForSud.DTOs
{
    public class CaseDTO
    {
        public string NomerOfCase { get; set; }

        public string NameOfCurt { get; set; }

        public string Applicant { get; set; }

        public string Defendant { get; set; }

        public string Reason { get; set; }

        public DateTime? DateOfCurt { get; set; }

        public string ResultOfCurt { get; set; }

        public DateTime? DateOfResult { get; set; }

    }
}
