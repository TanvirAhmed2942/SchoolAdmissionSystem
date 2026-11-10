using Microsoft.Extensions.DependencyInjection;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Application.Services;

namespace SchoolAdmissionSystem.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Singletons because the repositories keep their data in memory.
            // Switch to scoped when they are backed by a real database (e.g. EF Core DbContext).
            services.AddScoped<IAdminService, AdminService>();


            return services;
        }
    }
}
