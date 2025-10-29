namespace ApiForSud.DTOs
{
    public class CaseWithInstancesDTO
    {
        public CaseDTO Case { get; set; }
        public List<CurtInstaceDTO> Instances { get; set; } = new();
    }
}
