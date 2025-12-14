using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.DTOs
{
    public class CaseUserDto : Case
    {
        public string UserFio { get; set; }
    }
}
