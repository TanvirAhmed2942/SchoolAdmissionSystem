using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Domain.Entities;

namespace SchoolAdmissionSystem.Application.Interfaces
{
    public interface IAdminRepository
    {
        Task<ClassOverviewDto> AddClassAsync(AdminDto createClassDto);
        Task<List<ClassOverviewDto>> GetAllClassesAsync();
        Task<SchoolClass?> GetClassByIdAsync(Guid classId);
        Task<bool> DeleteClassAsync(Guid classId);
    }
}
