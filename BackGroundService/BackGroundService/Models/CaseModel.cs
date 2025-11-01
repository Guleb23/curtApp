using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Models
{
    internal class CaseModel
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

        public bool IsMarkeredByAdmin { get; set; }

        public bool IsUnMarkeredByAdmin { get; set; }

        public bool IsNotificated { get; set; }
    }
}
