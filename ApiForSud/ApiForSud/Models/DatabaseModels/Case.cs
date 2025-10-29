using ApiForSud.DTOs;

namespace ApiForSud.Models.DatabaseModels
{
    public class Case
    {

        public Guid Id { get; set; }

        public string NomerOfCase { get; set; }

        public string NameOfCurt { get; set; }

        public string Applicant { get; set; }

        public string Defendant { get; set; }

        public string Reason { get; set; }

        public DateTime? DateOfCurt { get; set; }

        public string ResultOfCurt { get; set; }

        public DateTime? DateOfResult { get; set; }

        public Guid UserId { get; set; }

        public bool IsMarkeredByAdmin { get; set; } = false;

        public bool IsUnMarkeredByAdmin { get; set; } = false;

        public virtual User User { get; set; } = null;

        public virtual ICollection<CurtInstance> CurtInstances { get; set; } = new List<CurtInstance>();
    }
}
