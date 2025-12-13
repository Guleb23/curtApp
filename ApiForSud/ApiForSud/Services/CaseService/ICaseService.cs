using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.Services.CaseService
{
    public interface ICaseService
    {
        public Task<Case> CreateCase(CaseDTO caseDTO, Guid userId);

        public Task<List<Case>> GetAllCases();
        public Task<List<Case>> GatArchiveCases();
        

        public Task<CaseResponseDTO> GetDetailCasesById(Guid userId, Guid caseId);


        public Task<List<Case>> GetCasesById(Guid userId);
        public Task<List<Case>> GatArchiveCasesById(Guid userId);


        public Task<CaseResponseDTO> UpdateCase(CaseDTO caseDTO, Guid userId, Guid caseId, List<CurtInstaceDTO> curtInstaces);

        public Task<bool> DeleteCase(Guid caseId, Guid userId);

        Task<bool> MarkerByAdmin(Guid caseId);

        Task<bool> UnMarkerByAdmin(Guid caseId);
        Task<bool> Archive(Guid caseId);
        Task<bool> UnArchive(Guid caseId);
    }
}
