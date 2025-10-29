using ApiForSud.Data;
using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ApiForSud.Services.CurtInstanceService
{
    public class CurtInstanceService : ICurtInstanceService
    {

        private readonly ApplicationDBContext _dbContext;

        public CurtInstanceService(ApplicationDBContext dBContext)
        {
            _dbContext = dBContext;
        }
        public async Task<CurtInstance> CreateCurtInstance(Guid caseId, CurtInstaceDTO curtInstaceDTO, Guid userId)
        {

            var caseExists = await _dbContext.Cases
                .AnyAsync(c => c.Id == caseId && c.UserId == userId);

            if (!caseExists)
            {
                return null;
            }

            var newInstance = new CurtInstance()
            {
                Id = Guid.NewGuid(),
                Name = curtInstaceDTO.Name,
                NameOfCurt = curtInstaceDTO.NameOfCurt,
                DateOfSession = curtInstaceDTO.DateOfSession,
                Link = curtInstaceDTO.Link,
                Employee = curtInstaceDTO.Employee,
                ResultOfIstance = curtInstaceDTO.ResultOfIstance,
                DateOfResult = curtInstaceDTO.DateOfResult,
                CaseId = caseId
            };

            _dbContext.CurtInstances.Add(newInstance);
            await _dbContext.SaveChangesAsync();

            return newInstance;
        }

        public async Task<bool> DeleteCurtInstance(Guid caseId, Guid userId, Guid instanceId)
        {
            var instanceToDelete = await _dbContext.CurtInstances
                .Include(ci => ci.Case)
                .FirstOrDefaultAsync(ci =>
                    ci.Id == instanceId &&
                    ci.CaseId == caseId &&
                    ci.Case.UserId == userId);

            if (instanceToDelete == null)
            {
                return false;

            }

            _dbContext.CurtInstances.Remove(instanceToDelete);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<CurtInstance?> UpdateCurtInstance(Guid caseId, CurtInstaceDTO curtInstaceDTO, Guid userId, Guid instanceId)
        {
            var instanceToUpdate = await _dbContext.CurtInstances
                .Include(ci => ci.Case)
                .FirstOrDefaultAsync(ci =>
                    ci.Id == instanceId &&
                    ci.CaseId == caseId &&
                    ci.Case.UserId == userId);

            if (instanceToUpdate == null)
            {
                return null;
            }

            instanceToUpdate.Name = curtInstaceDTO.Name;
            instanceToUpdate.NameOfCurt = curtInstaceDTO.NameOfCurt;
            instanceToUpdate.DateOfSession = curtInstaceDTO.DateOfSession;
            instanceToUpdate.Link = curtInstaceDTO.Link;
            instanceToUpdate.Employee = curtInstaceDTO.Employee;
            instanceToUpdate.ResultOfIstance = curtInstaceDTO.ResultOfIstance;
            instanceToUpdate.DateOfResult = curtInstaceDTO.DateOfResult;

            await _dbContext.SaveChangesAsync();
            return instanceToUpdate;
        }
    }
}
