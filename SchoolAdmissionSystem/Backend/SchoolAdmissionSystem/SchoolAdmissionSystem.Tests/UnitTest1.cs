
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SchoolAdmissionSystem.Domain.Entities;
using SchoolAdmissionSystem.Domain.Enums;
using SchoolAdmissionSystem.Infrastructure.Persistence;
using Testcontainers.PostgreSql;

namespace SchoolAdmissionSystem.Tests;

public class UnitTest1 : IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres =
        new PostgreSqlBuilder()
            .WithImage("postgres:16-alpine")
            .WithDatabase("school_admission_test")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .Build();

    private CustomWebApplicationFactory _factory = null!;

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();

        _factory = new CustomWebApplicationFactory(
            _postgres.GetConnectionString());
    }

    private async Task<Guid> CreateClassWithOneSeat()
    {
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var schoolClass = new SchoolClass
        {
            Id = Guid.NewGuid(),
            Name = "Concurrency Test Class",
            TotalSeats = 1,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow
        };

        dbContext.SchoolClasses.Add(schoolClass);

        await dbContext.SaveChangesAsync();

        return schoolClass.Id;
    }

    [Fact]
    public async Task OnlyOneStudent_ShouldGetTheLastAvailableSeat()
    {
        // Arrange: Create a class with one available seat
        var classId = await CreateClassWithOneSeat();

        // Create 10 simultaneous HTTP requests
        var tasks = Enumerable.Range(1, 10)
            .Select(async i =>
            {
                using var client = _factory.CreateClient();

                client.DefaultRequestHeaders.Add(
                    "X-Student-Id",
                    $"2020123456789{i:D4}"
                );

                return await client.PostAsync(
                    $"/api/candidate/classes/{classId}/holds",
                    null
                );
            });

        // Act: Wait for all requests to finish
        var responses = await Task.WhenAll(tasks);

        // Assert: Verify HTTP responses
        var successCount = responses.Count(r =>
            r.StatusCode == System.Net.HttpStatusCode.OK);

        var conflictCount = responses.Count(r =>
            r.StatusCode == System.Net.HttpStatusCode.Conflict);

        Assert.Equal(1, successCount);
        Assert.Equal(9, conflictCount);

        // Assert: Verify actual database state
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var activeHoldCount = await dbContext.AdmissionHold
            .CountAsync(h =>
                h.ClassId == classId &&
                h.Status == AdmissionStatus.HELD &&
                h.ExpiresAt > DateTime.UtcNow);

        Assert.Equal(1, activeHoldCount);
    }

    public async Task DisposeAsync()
    {
        await _factory.DisposeAsync();
        await _postgres.DisposeAsync();
    }
}
