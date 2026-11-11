using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Domain.Entities;
using SchoolAdmissionSystem.Domain.Enums;
using SchoolAdmissionSystem.Domain.Exceptions;
using SchoolAdmissionSystem.Infrastructure.Persistence;

namespace SchoolAdmissionSystem.Infrastructure.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ClassOverviewDto> AddClassAsync(AdminDto createClassDto)
        {
            ArgumentNullException.ThrowIfNull(createClassDto);

            var name = createClassDto.Name.Trim();

            var exists = await _context.SchoolClasses
                .AnyAsync(c => c.Name.ToLower() == name.ToLower());
            if (exists)
                throw new BusinessRuleException("A class with this name already exists.");

            var now = DateTime.UtcNow;
            var newClass = new SchoolClass
            {
                Id = Guid.NewGuid(),
                Name = name,
                TotalSeats = createClassDto.TotalSeats,
                CreatedAt = now,
                ModifiedAt = now
            };

            _context.SchoolClasses.Add(newClass);
            await _context.SaveChangesAsync();

            return new ClassOverviewDto
            {
                Id = newClass.Id,
                Name = newClass.Name,
                TotalSeats = newClass.TotalSeats
            };
        }

        public async Task<bool> DeleteClassAsync(Guid classId)
        {
            var now = DateTime.UtcNow;

            var schoolClass = await _context.SchoolClasses
                .Include(c => c.Holds)
                .SingleOrDefaultAsync(c => c.Id == classId);

            if (schoolClass == null)
                return false;

            var hasActiveAdmissions = schoolClass.Holds.Any(h =>
                h.Status == AdmissionStatus.CONFIRMED ||
                (h.Status == AdmissionStatus.HELD && h.ExpiresAt > now));

            if (hasActiveAdmissions)
                throw new BusinessRuleException(
                    "This class has active or confirmed admissions and cannot be deleted.");

            _context.SchoolClasses.Remove(schoolClass);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ClassOverviewDto>> GetAllClassesAsync()
        {
            var now = DateTime.UtcNow;

            return await _context.SchoolClasses
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .Select(c => new ClassOverviewDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    TotalSeats = c.TotalSeats,
                    ConfirmedSeats = c.Holds.Count(h => h.Status == AdmissionStatus.CONFIRMED),
                    HeldSeats = c.Holds.Count(h => h.Status == AdmissionStatus.HELD && h.ExpiresAt > now)
                })
                .ToListAsync();
        }

        public async Task<SchoolClass?> GetClassByIdAsync(Guid classId)
        {
            return await _context.SchoolClasses.FindAsync(classId);
        }
    }
}