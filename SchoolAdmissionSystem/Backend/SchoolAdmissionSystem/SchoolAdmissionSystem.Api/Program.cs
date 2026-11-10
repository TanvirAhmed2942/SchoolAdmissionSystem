using SchoolAdmissionSystem.Application;
using SchoolAdmissionSystem.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

var dbSettings =
    new Npgsql.NpgsqlConnectionStringBuilder(connectionString);

Console.WriteLine($"Connection string exists: {!string.IsNullOrWhiteSpace(connectionString)}");

Console.WriteLine($"Configuration key exists: {builder.Configuration["ConnectionStrings:DefaultConnection"] != null}");
Console.WriteLine($"Operating System: {Environment.OSVersion}");
Console.WriteLine($"Is Linux: {OperatingSystem.IsLinux()}");
Console.WriteLine($"Is Windows: {OperatingSystem.IsWindows()}");

Console.WriteLine(
    $"Running in Docker: {Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER")}"
);
try
{
    await using var connection =
        new Npgsql.NpgsqlConnection(connectionString);

    await connection.OpenAsync();

    Console.WriteLine("PostgreSQL connection successful!");
}
catch (Exception ex)
{
    Console.WriteLine(ex.ToString());
}

Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"Database Host: {dbSettings.Host}");
Console.WriteLine($"Database Port: {dbSettings.Port}");
Console.WriteLine($"Database Name: {dbSettings.Database}");

// Add services to the container.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);



builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
