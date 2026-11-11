using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Domain.Entities;
using SchoolAdmissionSystem.Domain.Enums;

namespace SchoolAdmissionSystem.Application.Interfaces
{
    public interface ICandidateRepository
    {
        Task<AdmissionHold?> GetByIdAsync(Guid holdId, string studentId);

        Task<List<AdmissionHold>> GetByStudentIdAsync(string studentId);

        Task<bool> HasActiveHoldAsync(Guid classId, string studentId);

        Task<int> CountByStatusAsync(Guid classId, AdmissionStatus status);

        Task<AdmissionHoldResponseDto>? AddAsync(AdmissionHold admissionHold);

        Task<AdmissionHoldResponseDto> UpdateAdmissionHoldAsync(Guid holdId, string studentId, AdmissionStatus status);

        Task<List<AdmissionHold>> GetExpiredHoldsAsync(DateTime currentTime);

        Task<int> ExpireOverdueHoldsAsync(DateTime now);
    }
}
