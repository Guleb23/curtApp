using ApiForSud.DTOs.ForReport;

namespace ApiForSud.Services.ReportService
{
    public interface IReportService
    {
        Task<List<ReportDto>> GenerateDataForReportAsync(DateTime startDate, DateTime endDate);
    }
}
