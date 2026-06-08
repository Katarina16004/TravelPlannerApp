using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TripService.Data
{
    public class TripDbContextFactory : IDesignTimeDbContextFactory<TripDbContext>
    {
        public TripDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json", optional: false)
               .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TripDbContext>();
            var connectionString = configuration["ConnectionStrings:DefaultConnection"];

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            }

            optionsBuilder.UseSqlServer(connectionString);

            return new TripDbContext(optionsBuilder.Options);
        }
    }
}
