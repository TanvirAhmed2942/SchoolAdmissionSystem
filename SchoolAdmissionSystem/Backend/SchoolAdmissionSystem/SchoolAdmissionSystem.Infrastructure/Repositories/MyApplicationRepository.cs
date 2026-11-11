using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Domain.Enums;
using SchoolAdmissionSystem.Infrastructure.Persistence;

namespace SchoolAdmissionSystem.Infrastructure.Repositories
{
    public class MyApplicationRepository : IMyApplicationRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public MyApplicationRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
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
            var now = DateTime.UtcNow;

            return await _dbContext.AdmissionHold
                .AsNoTracking()
                .Where(app => app.StudentId == studentId)
                .OrderByDescending(app => app.CreatedAt)
                .Select(app => new MyApplicationDto
                {
                    Id = app.Id,
                    ClassId = app.ClassId,
                    ClassName = app.Class.Name,
                    StudentId = app.StudentId,
                    CreatedAt = app.CreatedAt,
                    ModifiedAt = app.ModifiedAt,
                    ConfirmedAt = app.ConfirmedAt,
                    ExpiresAt = app.ExpiresAt,
                    // Report overdue holds as EXPIRED even if the background worker hasn't run yet
                    Status = app.Status == AdmissionStatus.HELD && app.ExpiresAt <= now
                        ? AdmissionStatus.EXPIRED
                        : app.Status
                })
                .ToListAsync();
        }
    }
}
