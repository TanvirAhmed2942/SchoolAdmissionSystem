using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Domain.Entities;

namespace SchoolAdmissionSystem.Application.Interfaces
{
    public interface IAdminService
    {
        Task<ClassOverviewDto> CreateClassAsync(AdminDto createClassDto);
        Task<bool> DeleteClassAsync(Guid classId);
        Task<List<ClassOverviewDto>> GetAllClassesAsync();
        Task<SchoolClass?> GetClassByIdAsync(Guid classId);
    }
}
