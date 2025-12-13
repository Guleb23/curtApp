namespace ApiForSud.DTOs.ForReport
{
    public class ShortInstanceDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string NameOfCurt { get; set; }
        public DateTime? DateOfSession { get; set; }
        public string Link { get; set; }
        public string Employee { get; set; }
        public string ResultOfIstance { get; set; }
        public DateTime? DateOfResult { get; set; }
    }
}
