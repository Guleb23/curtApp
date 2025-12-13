using ApiForSud.DTOs.ForReport;

namespace ApiForSud.Services.PdfService
{
    public interface IPdfService
    {
        public byte[] GeneratePdfReport(List<ReportDto> reportList, DateTime startDate, DateTime endDate);
    }
}
