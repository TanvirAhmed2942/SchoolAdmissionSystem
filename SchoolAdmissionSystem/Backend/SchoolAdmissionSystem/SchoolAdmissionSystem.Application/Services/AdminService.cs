using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Domain.Entities;

namespace SchoolAdmissionSystem.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<ClassOverviewDto> CreateClassAsync(AdminDto createClassDto)
        {
            ArgumentNullException.ThrowIfNull(createClassDto);
            return await _adminRepository.AddClassAsync(createClassDto);
        }

        public async Task<bool> DeleteClassAsync(Guid classId)
        {
            return await _adminRepository.DeleteClassAsync(classId);
        }

        public async Task<List<ClassOverviewDto>> GetAllClassesAsync()
        {
            return await _adminRepository.GetAllClassesAsync();
        }

        public async Task<SchoolClass?> GetClassByIdAsync(Guid classId)
        {
            return await _adminRepository.GetClassByIdAsync(classId);
        }
    }
}