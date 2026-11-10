using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Domain.Entities;

namespace SchoolAdmissionSystem.Application.Interfaces
{
    public interface IAdminRepository
    {
        Task<SchoolClass> AddClassAsync(CreateClassDto createClassDto);
        Task<List<SchoolClass>> GetAllClassesAsync();
        Task<SchoolClass?> GetClassByIdAsync(Guid classId);
        Task<bool> DeleteClassAsync(Guid classId);
    }
}
