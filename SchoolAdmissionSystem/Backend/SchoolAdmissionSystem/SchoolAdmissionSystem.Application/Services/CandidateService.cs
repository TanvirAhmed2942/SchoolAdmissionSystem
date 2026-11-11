using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Domain.Entities;
using SchoolAdmissionSystem.Domain.Enums;

namespace SchoolAdmissionSystem.Application.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly ICandidateRepository _candidateRepository;

        public CandidateService(ICandidateRepository candidateRepository)
        {
            _candidateRepository = candidateRepository;
        }

        async Task<AdmissionHoldResponseDto> ICandidateService.CancelHoldAsync(Guid holdId, string studentId, AdmissionStatus status)
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                throw new ArgumentException("Student ID cannot be null or empty.", nameof(studentId));
            }
            if (holdId == Guid.Empty)
            {

                throw new ArgumentException("Application ID cannot be empty.", nameof(holdId));
            }

            var application = await _candidateRepository.UpdateAdmissionHoldAsync(holdId, studentId, status);
            if (application == null)
            {
                return null;
            }
            var responseDto = new AdmissionHoldResponseDto
            {
                Id = application.Id,
                ClassId = application.ClassId,
                StudentId = application.StudentId,
                Status = application.Status,
                ConfirmedAt = application.ConfirmedAt,
                CreatedAt = application.CreatedAt,
                ExpiresAt = application.ExpiresAt,

            };

            return responseDto;
        }

        Task<AdmissionHoldResponseDto> ICandidateService.ConfirmHoldAsync(Guid holdId, string studentId)
        {
            throw new NotImplementedException();
        }

        Task<AdmissionHoldResponseDto>? ICandidateService.CreateHoldAsync(Guid classId, string studentId)
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                throw new ArgumentException("Student ID cannot be null or empty.", nameof(studentId));
            }
            if (classId == Guid.Empty)
            {

                throw new ArgumentException("Class ID cannot be empty.", nameof(classId));
            }

            var newHold = new AdmissionHold
            {
                Id = Guid.NewGuid(),
                ClassId = classId,
                StudentId = studentId,
                Status = Domain.Enums.AdmissionStatus.HELD,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7) // Assuming a hold expires in 7 days
            };
            return _candidateRepository.AddAsync(newHold);
        }

        async Task<AdmissionHoldResponseDto>? ICandidateService.GetHoldByIdAsync(Guid holdId, string studentId)
        {
            if (string.IsNullOrWhiteSpace(studentId))
            {
                throw new ArgumentException("Student ID cannot be null or empty.", nameof(studentId));
            }
            if (holdId == Guid.Empty)
            {

                throw new ArgumentException("Class ID cannot be empty.", nameof(holdId));
            }

            var application = await _candidateRepository.GetByIdAsync(holdId, studentId);
            if (application is null)
            {
                return null;
            }

            var responseDto = new AdmissionHoldResponseDto
            {
                Id = application.Id,
                ClassId = application.ClassId,
                StudentId = application.StudentId,
                Status = application.Status,
                ConfirmedAt = application.ConfirmedAt,
                CreatedAt = application.CreatedAt,
                ExpiresAt = application.ExpiresAt,

            };

            return responseDto;
        }

        Task<List<AdmissionHoldResponseDto>> ICandidateService.GetMyHoldsAsync(string studentId)
        {
            throw new NotImplementedException();
        }
    }
}
