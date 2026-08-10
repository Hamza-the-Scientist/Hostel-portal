// =============================================================================
// Infrastructure/Persistence/DesignTimeDbContextFactory.cs
// Used ONLY by EF tooling (dotnet ef migrations add/update).
// Reads connection string from appsettings.json or env var.
// =============================================================================
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SindhDormitory.Infrastructure.Persistence;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Walk up to find appsettings.json relative to project directory
        var basePath = Path.Combine(
            Directory.GetCurrentDirectory(), "..", "SindhDormitory.API");

        var config = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection")
            ?? "Server=localhost;Database=SindhDormitoryDb;User=root;Password=;";

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseMySql(
            connectionString,
            new MySqlServerVersion(new Version(8, 0, 31)));

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
