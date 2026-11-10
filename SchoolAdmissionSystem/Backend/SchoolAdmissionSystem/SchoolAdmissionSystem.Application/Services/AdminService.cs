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

        public async Task<SchoolClass> CreateClassAsync(CreateClassDto createClassDto)
        {
            if (createClassDto == null)
            {
                throw new ArgumentNullException(nameof(createClassDto));
            }
            // Implementation for creating a new class

            var newClass = await _adminRepository.AddClassAsync(createClassDto);
            if (newClass == null)
            {
                throw new Exception("Failed to create class.");
            }
            return await Task.FromResult(newClass);
        }

        public async Task<bool> DeleteClassAsync(Guid classId)
        {
            return await _adminRepository.DeleteClassAsync(classId);
        }

        public async Task<List<SchoolClass>> GetAllClassesAsync()
        {
            return await _adminRepository.GetAllClassesAsync();
        }

        public async Task<SchoolClass?> GetClassByIdAsync(Guid classId)
        {
            throw new NotImplementedException();
        }
    }
}
