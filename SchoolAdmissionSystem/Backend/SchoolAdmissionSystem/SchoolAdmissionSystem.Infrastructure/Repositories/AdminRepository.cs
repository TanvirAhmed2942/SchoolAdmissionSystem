using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Domain.Entities;
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

        async Task<SchoolClass> IAdminRepository.AddClassAsync(CreateClassDto createClassDto)
        {
            if (createClassDto == null)
            {
                throw new ArgumentNullException(nameof(createClassDto));
            }
            var newClass = new SchoolClass
            {
                Id = Guid.NewGuid(),
                Name = createClassDto.Name,
                TotalSeats = createClassDto.TotalSeats
            };
            _context.SchoolClasses.Add(newClass);
            await _context.SaveChangesAsync();
            return newClass;

        }

        public async Task<bool> DeleteClassAsync(Guid classId)
        {
            var schoolClass = await _context.SchoolClasses
                .SingleOrDefaultAsync(c => c.Id == classId);

            if (schoolClass == null)
                return false;

            _context.SchoolClasses.Remove(schoolClass);

            await _context.SaveChangesAsync();

            return true;
        }

        async Task<List<SchoolClass>> IAdminRepository.GetAllClassesAsync()
        {
            return await _context.SchoolClasses.ToListAsync();
        }

        async Task<SchoolClass?> IAdminRepository.GetClassByIdAsync(Guid classId)
        {
            return await _context.SchoolClasses.FindAsync(classId);
        }
    }
}
