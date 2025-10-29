using ApiForSud.Data;
using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;
using Microsoft.EntityFrameworkCore;

namespace ApiForSud.Services.CaseService
{
    public class CaseService : ICaseService
    {
        private readonly ApplicationDBContext _dbContext;
        public CaseService(ApplicationDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task<Case> CreateCase(CaseDTO caseDTO, Guid userId)
        {

            var user = await _dbContext.Users.AnyAsync(u => u.Id == userId);

            if(user == false)
            {
                return null;
            }
            else
            {
                var newCase = new Case
                {
                    Id = Guid.NewGuid(),
                    NomerOfCase = caseDTO.NomerOfCase,
                    NameOfCurt = caseDTO.NameOfCurt,
                    Applicant = caseDTO.Applicant,
                    Defendant = caseDTO.Defendant,
                    Reason = caseDTO.Reason,
                    DateOfCurt = caseDTO.DateOfCurt,
                    UserId = userId,
                    ResultOfCurt = caseDTO.ResultOfCurt,
                    DateOfResult = caseDTO.DateOfResult
                };

                _dbContext.Cases.Add(newCase);
                await _dbContext.SaveChangesAsync();
                return newCase;
            }

            
        }

        public async Task<List<Case>> GetAllCases()
        {
            return await _dbContext.Cases.ToListAsync();
        }

        public async Task<CaseResponseDTO?> GetDetailCasesById( Guid userId, Guid caseId)
        {
            var currentUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (currentUser.RoleId == 2)
            {
                return await _dbContext.Cases
                .Where(c => c.Id == caseId)
                .Include(c => c.CurtInstances)
                .Select(c => new CaseResponseDTO
                {
                    Id = c.Id,
                    NomerOfCase = c.NomerOfCase,
                    NameOfCurt = c.NameOfCurt,
                    Applicant = c.Applicant,
                    Defendant = c.Defendant,
                    Reason = c.Reason,
                    DateOfCurt = c.DateOfCurt,
                    ResultOfCurt = c.ResultOfCurt,
                    DateOfResult = c.DateOfResult,
                    CurtInstances = c.CurtInstances.Select(ci => new CurtInstanceResponseDTO
                    {
                        Id = ci.Id,
                        Name = ci.Name,
                        NameOfCurt = ci.NameOfCurt,
                        DateOfSession = ci.DateOfSession,
                        Link = ci.Link,
                        Employee = ci.Employee,
                        ResultOfIstance = ci.ResultOfIstance,
                        DateOfResult = ci.DateOfResult
                    }).ToList()
                })
                .FirstOrDefaultAsync();
            }

            else
            {
                return await _dbContext.Cases
                .Where(c => c.Id == caseId && c.UserId == userId)
                .Include(c => c.CurtInstances)
                .Select(c => new CaseResponseDTO
                {
                    Id = c.Id,
                    NomerOfCase = c.NomerOfCase,
                    NameOfCurt = c.NameOfCurt,
                    Applicant = c.Applicant,
                    Defendant = c.Defendant,
                    Reason = c.Reason,
                    DateOfCurt = c.DateOfCurt,
                    ResultOfCurt = c.ResultOfCurt,
                    DateOfResult = c.DateOfResult,
                    CurtInstances = c.CurtInstances.Select(ci => new CurtInstanceResponseDTO
                    {
                        Id = ci.Id,
                        Name = ci.Name,
                        NameOfCurt = ci.NameOfCurt,
                        DateOfSession = ci.DateOfSession,
                        Link = ci.Link,
                        Employee = ci.Employee,
                        ResultOfIstance = ci.ResultOfIstance,
                        DateOfResult = ci.DateOfResult
                    }).ToList()
                })
                .FirstOrDefaultAsync();
            }
            
        }

        public async Task<List<Case>> GetCasesById(Guid userId)
        {
            return await _dbContext.Cases.Where(c => c.UserId == userId).ToListAsync();
        }

        public async Task<bool> DeleteCase(Guid caseId, Guid userId)
        {
            var caseToDelete = await _dbContext.Cases
                .FirstOrDefaultAsync(c => c.Id == caseId && c.UserId == userId);

            if (caseToDelete == null)
            {
                return false;
            }

            _dbContext.Cases.Remove(caseToDelete);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<CaseResponseDTO?> UpdateCase(CaseDTO caseDTO, Guid userId, Guid caseId, List<CurtInstaceDTO> curtInstaces)
        {
            var caseToUpdate = await _dbContext.Cases
                .FirstOrDefaultAsync(c => c.Id == caseId && c.UserId == userId);

            if (caseToUpdate == null)
                return null;

            // Обновляем дело
            caseToUpdate.NomerOfCase = caseDTO.NomerOfCase;
            caseToUpdate.NameOfCurt = caseDTO.NameOfCurt;
            caseToUpdate.Applicant = caseDTO.Applicant;
            caseToUpdate.Defendant = caseDTO.Defendant;
            caseToUpdate.Reason = caseDTO.Reason;
            caseToUpdate.DateOfCurt = caseDTO.DateOfCurt;
            caseToUpdate.ResultOfCurt = caseDTO.ResultOfCurt;
            caseToUpdate.DateOfResult = caseDTO.DateOfResult;

            // Удаляем старые инстанции
            var existingInstances = await _dbContext.CurtInstances
                .Where(ci => ci.CaseId == caseId)
                .ToListAsync();

            _dbContext.CurtInstances.RemoveRange(existingInstances);

            // Добавляем новые инстанции
            foreach (var instanceDto in curtInstaces)
            {
                _dbContext.CurtInstances.Add(new CurtInstance
                {
                    Id = Guid.NewGuid(),
                    Name = instanceDto.Name,
                    NameOfCurt = instanceDto.NameOfCurt,
                    DateOfSession = instanceDto.DateOfSession,
                    Link = instanceDto.Link,
                    Employee = instanceDto.Employee,
                    ResultOfIstance = instanceDto.ResultOfIstance,
                    DateOfResult = instanceDto.DateOfResult,
                    CaseId = caseId
                });
            }

            await _dbContext.SaveChangesAsync();

            // Возвращаем DTO вместо Entity
            return await _dbContext.Cases
                .Where(c => c.Id == caseId)
                .Select(c => new CaseResponseDTO
                {
                    Id = c.Id,
                    NomerOfCase = c.NomerOfCase,
                    NameOfCurt = c.NameOfCurt,
                    Applicant = c.Applicant,
                    Defendant = c.Defendant,
                    Reason = c.Reason,
                    DateOfCurt = c.DateOfCurt,
                    ResultOfCurt = c.ResultOfCurt,
                    DateOfResult = c.DateOfResult,
                    CurtInstances = c.CurtInstances.Select(ci => new CurtInstanceResponseDTO
                    {
                        Id = ci.Id,
                        Name = ci.Name,
                        NameOfCurt = ci.NameOfCurt,
                        DateOfSession = ci.DateOfSession,
                        Link = ci.Link,
                        Employee = ci.Employee,
                        ResultOfIstance = ci.ResultOfIstance,
                        DateOfResult = ci.DateOfResult
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> MarkerByAdmin(Guid caseId)
        {
            var currentCase = await _dbContext.Cases.FirstOrDefaultAsync(c => c.Id == caseId);

            if (currentCase == null) 
            {
                return false;
            }
            else
            {
                currentCase.IsMarkeredByAdmin = true;
                currentCase.IsUnMarkeredByAdmin = false;

                await _dbContext.SaveChangesAsync();

                return true;
            }
        }

        public async Task<bool> UnMarkerByAdmin(Guid caseId)
        {
            var currentCase = await _dbContext.Cases.FirstOrDefaultAsync(c => c.Id == caseId);

            if (currentCase == null)
            {
                return false;
            }
            else
            {
                currentCase.IsMarkeredByAdmin = false;
                currentCase.IsUnMarkeredByAdmin = true;
                await _dbContext.SaveChangesAsync();

                return true;
            }

        }
    }
}
