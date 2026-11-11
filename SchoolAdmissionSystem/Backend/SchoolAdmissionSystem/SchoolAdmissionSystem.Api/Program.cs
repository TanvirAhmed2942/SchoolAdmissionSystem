using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Api.Middleware;
using SchoolAdmissionSystem.Application;
using SchoolAdmissionSystem.Application.Options;
using SchoolAdmissionSystem.Infrastructure;
using SchoolAdmissionSystem.Infrastructure.BackgroundServices;
using SchoolAdmissionSystem.Infrastructure.Persistence;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<DatabaseDataCleaner>();

builder.Services.Configure<AdmissionHoldOptions>(
    builder.Configuration.GetSection(AdmissionHoldOptions.SectionName));
builder.Services.AddHostedService<HoldExpiryWorker>();



//var connectionString =
//    builder.Configuration.GetConnectionString("DefaultConnection");

//var dbSettings =
//    new Npgsql.NpgsqlConnectionStringBuilder(connectionString);

//Console.WriteLine($"Connection string exists: {!string.IsNullOrWhiteSpace(connectionString)}");

//Console.WriteLine($"Configuration key exists: {builder.Configuration["ConnectionStrings:DefaultConnection"] != null}");
//Console.WriteLine($"Operating System: {Environment.OSVersion}");
//Console.WriteLine($"Is Linux: {OperatingSystem.IsLinux()}");
//Console.WriteLine($"Is Windows: {OperatingSystem.IsWindows()}");

//Console.WriteLine(
//    $"Running in Docker: {Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER")}"
//);
//try
//{
//    await using var connection =
//        new Npgsql.NpgsqlConnection(connectionString);

//    await connection.OpenAsync();

//    Console.WriteLine("PostgreSQL connection successful!");
//}
//catch (Exception ex)
//{
//    Console.WriteLine(ex.ToString());
//}

//Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
//Console.WriteLine($"Database Host: {dbSettings.Host}");
//Console.WriteLine($"Database Port: {dbSettings.Port}");
//Console.WriteLine($"Database Name: {dbSettings.Database}");

// Add services to the container.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy => policy
        .WithOrigins(
            "http://192.168.68.61:5173",
            "http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod());
});


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "School Admission System v1");
    });
}

if (app.Environment.IsDevelopment())
{
    app.MapPost("/dev/clear-database", async (DatabaseDataCleaner cleaner) =>
    {
        await cleaner.ClearAllDataAsync();
        return Results.Ok("Database data cleared successfully.");
    })
    .RequireCors("Frontend");
}

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
}
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var dbContext = services.GetRequiredService<ApplicationDbContext>();

    await dbContext.Database.MigrateAsync();
}


if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors("Frontend");
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();
public partial class Program { }