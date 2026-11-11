using SchoolAdmissionSystem.Application.Dto;

namespace SchoolAdmissionSystem.Application.Interfaces
{
    public interface IMyApplicationRepository
    {
        Task<List<MyApplicationDto>> GetMyApplicationsAsync(string studentId);
        Task<MyApplicationDto?> GetMyApplicationByIdAsync(Guid applicationId, string studentId);
        Task<bool> DeleteMyApplicationAsync(Guid applicationId, string studentId);
    }
}
