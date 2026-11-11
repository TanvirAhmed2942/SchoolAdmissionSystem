using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Domain.Enums;

namespace SchoolAdmissionSystem.Application.Interfaces
{
    public interface ICandidateService
    {
        Task<AdmissionHoldResponseDto>? CreateHoldAsync(
        Guid classId,
        string studentId);

        Task<AdmissionHoldResponseDto>? GetHoldByIdAsync(
            Guid holdId,
            string studentId);

        Task<AdmissionHoldResponseDto> ConfirmHoldAsync(
            Guid holdId,
            string studentId);

        Task<AdmissionHoldResponseDto> CancelHoldAsync(
            Guid holdId,
            string studentId,
            AdmissionStatus status
            );

        Task<List<AdmissionHoldResponseDto>> GetMyHoldsAsync(
            string studentId);
    }
}
