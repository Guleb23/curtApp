namespace ApiForSud.DTOs.ForReport
{
    public class ReportDto
    {

        public string FIO { get; set; }

        public int CountCases { get; set; }

        public List<ShortCaseDto> Cases { get; set; } = new List<ShortCaseDto>();
    }
}
