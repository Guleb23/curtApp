using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.DTOs.ForReport
{
    public class ShortCaseDto
    {
        public Guid Id { get; set; }
        public string NomerOfCase { get; set; }
        public string NameOfCurt { get; set; }
        public string Applicant { get; set; }
        public string Defendant { get; set; }
        public string Reason { get; set; }
        public DateTime? DateOfCurt { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ResultOfCurt { get; set; }
        public DateTime? DateOfResult { get; set; }
        public ICollection<ShortInstanceDto> CurtInstances { get; set; } = new List<ShortInstanceDto>();
    }
}
