using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.Services.CurtInstanceService
{
    public interface ICurtInstanceService
    {

        Task<CurtInstance> CreateCurtInstance(Guid caseId, CurtInstaceDTO curtInstaceDTO, Guid userId);

        Task<bool> DeleteCurtInstance(Guid caseId, Guid userId, Guid instanceId);

        Task<CurtInstance> UpdateCurtInstance(Guid caseId, CurtInstaceDTO curtInstaceDTO, Guid userId, Guid instanceId);
    }
}
