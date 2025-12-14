namespace ApiForSud.Models.DatabaseModels
{
    public class Curt
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int CaseId { get; set; }

        public Case Case { get; set; }
    }
}
