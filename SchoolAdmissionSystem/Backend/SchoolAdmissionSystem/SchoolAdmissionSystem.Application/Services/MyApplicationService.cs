using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;

namespace SchoolAdmissionSystem.Application.Services
{
    public class MyApplicationService : IMyApplicationService
    {
        public readonly IMyApplicationRepository _myApplicationRepository;
        public MyApplicationService(IMyApplicationRepository myApplicationRepository)
        {
            _myApplicationRepository = myApplicationRepository;
        }

        public Task<bool> DeleteMyApplicationAsync(Guid applicationId, string studentId)
        {
            throw new NotImplementedException();
        }

        public Task<MyApplicationDto?> GetMyApplicationByIdAsync(Guid applicationId, string studentId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<MyApplicationDto>> GetMyApplicationsAsync(string studentId)
        {
            if (string.IsNullOrEmpty(studentId))
            {
                throw new ArgumentException("Student ID cannot be null or empty.", nameof(studentId));
            }

            var myApplications = await _myApplicationRepository.GetMyApplicationsAsync(studentId);
            return myApplications;
        }
    }
}
