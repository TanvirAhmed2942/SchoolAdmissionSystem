using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Application.Options;
using SchoolAdmissionSystem.Domain.Entities;
using SchoolAdmissionSystem.Domain.Enums;
using SchoolAdmissionSystem.Domain.Exceptions;
using SchoolAdmissionSystem.Infrastructure.Persistence;

namespace SchoolAdmissionSystem.Infrastructure.Repositories
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly AdmissionHoldOptions _options;

        public CandidateRepository(ApplicationDbContext dbContext, IOptions<AdmissionHoldOptions> options)
        {
            _dbContext = dbContext;
            _options = options.Value;
        }

        // The caller only needs to pass ClassId and StudentId; the rest is set here.
        public async Task<AdmissionHoldResponseDto> AddAsync(AdmissionHold request)
        {
            await using var tx = await _dbContext.Database.BeginTransactionAsync();

            var schoolClass = await _dbContext.SchoolClasses
                .FirstOrDefaultAsync(c => c.Id == request.ClassId);

            if (schoolClass == null)
                throw new BusinessRuleException("The specified class does not exist.");

            // Serialize hold creation per class so two requests can't take the last seat
            await _dbContext.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT 1 FROM \"SchoolClasses\" WHERE \"Id\" = {request.ClassId} FOR UPDATE");

            var now = DateTime.UtcNow;

            var studentHolds = await _dbContext.AdmissionHold
                .Where(h => h.ClassId == request.ClassId && h.StudentId == request.StudentId)
                .Select(h => new { h.Status, h.ExpiresAt })
                .ToListAsync();

            if (studentHolds.Any(h => h.Status == AdmissionStatus.CONFIRMED))
                throw new BusinessRuleException("This student is already confirmed in this class.");

            if (studentHolds.Any(h => h.Status == AdmissionStatus.HELD && h.ExpiresAt > now))
                throw new BusinessRuleException("A hold already exists for this student in the specified class.");

            // Seats taken = confirmed + holds that haven't expired yet
            var seatsTaken = await _dbContext.AdmissionHold.CountAsync(h =>
                h.ClassId == request.ClassId &&
                (h.Status == AdmissionStatus.CONFIRMED ||
                 (h.Status == AdmissionStatus.HELD && h.ExpiresAt > now)));

            if (seatsTaken >= schoolClass.TotalSeats)
                throw new BusinessRuleException("No seats are available in this class.");

            var hold = AdmissionHold.Create(
                request.ClassId, request.StudentId, now,
                TimeSpan.FromMinutes(_options.HoldDurationMinutes));

            _dbContext.AdmissionHold.Add(hold);
            await _dbContext.SaveChangesAsync();
            await tx.CommitAsync();

            return ToDto(hold, schoolClass.Name);
        }

        public async Task<AdmissionHold?> GetByIdAsync(Guid holdId, string studentId)
        {
            return await _dbContext.AdmissionHold
                .Include(h => h.Class)
                .FirstOrDefaultAsync(h => h.Id == holdId && h.StudentId == studentId);
        }

        public async Task<AdmissionHoldResponseDto> UpdateAdmissionHoldAsync(
            Guid holdId, string studentId, AdmissionStatus status)
        {
            var hold = await _dbContext.AdmissionHold
                .Include(h => h.Class)
                .FirstOrDefaultAsync(h => h.Id == holdId && h.StudentId == studentId);

            if (hold == null)
                throw new BusinessRuleException("The specified hold does not exist.");

            var now = DateTime.UtcNow;

            switch (status)
            {
                case AdmissionStatus.CONFIRMED:
                    hold.Confirm(now);
                    break;
                case AdmissionStatus.CANCELLED:
                    hold.Cancel(now);
                    break;
                default:
                    throw new BusinessRuleException("A hold can only be confirmed or cancelled.");
            }

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new BusinessRuleException("This hold was just changed by another request. Please refresh and try again.");
            }

            return ToDto(hold, hold.Class.Name);
        }

        public async Task<int> ExpireOverdueHoldsAsync(DateTime now)
        {
            return await _dbContext.AdmissionHold
                .Where(h => h.Status == AdmissionStatus.HELD && h.ExpiresAt <= now)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(h => h.Status, AdmissionStatus.EXPIRED)
                    .SetProperty(h => h.ModifiedAt, now));
        }

        public async Task<int> CountByStatusAsync(Guid classId, AdmissionStatus status)
        {
            return await _dbContext.AdmissionHold
                .CountAsync(h => h.ClassId == classId && h.Status == status);
        }

        public async Task<List<AdmissionHold>> GetByStudentIdAsync(string studentId)
        {
            return await _dbContext.AdmissionHold
                .Include(h => h.Class)
                .Where(h => h.StudentId == studentId)
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<AdmissionHold>> GetExpiredHoldsAsync(DateTime currentTime)
        {
            return await _dbContext.AdmissionHold
                .Where(h => h.Status == AdmissionStatus.HELD && h.ExpiresAt <= currentTime)
                .ToListAsync();
        }

        public async Task<bool> HasActiveHoldAsync(Guid classId, string studentId)
        {
            var now = DateTime.UtcNow;
            return await _dbContext.AdmissionHold.AnyAsync(h =>
                h.ClassId == classId && h.StudentId == studentId &&
                h.Status == AdmissionStatus.HELD && h.ExpiresAt > now);
        }

        private static AdmissionHoldResponseDto ToDto(AdmissionHold hold, string className) => new()
        {
            Id = hold.Id,
            ClassId = hold.ClassId,
            ClassName = className,
            StudentId = hold.StudentId,
            Status = hold.Status,
            CreatedAt = hold.CreatedAt,
            ModifiedAt = hold.ModifiedAt,
            ExpiresAt = hold.ExpiresAt,
            ConfirmedAt = hold.ConfirmedAt
        };
    }
}