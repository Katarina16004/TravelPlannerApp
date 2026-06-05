using Common.Enums;
using Microsoft.EntityFrameworkCore;
using TripService.Models;

namespace TripService.Data
{
    public class TripDbContext:DbContext
    {
        public TripDbContext(DbContextOptions<TripDbContext> options) : base(options)
        {
        }

        public DbSet<Trip> Trips { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Trip>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasDefaultValueSql("newid()");
                entity.Property(e => e.UserId).IsRequired();
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.StartDate).IsRequired();
                entity.Property(e => e.EndDate).IsRequired();
                entity.Property(e => e.Budget).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.Note).IsRequired(false);

                entity.HasIndex(e => e.UserId);
            });


            modelBuilder.Entity<Destination>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasDefaultValueSql("newid()");
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Location).IsRequired();
                entity.Property(e => e.ArrivalDate).IsRequired();
                entity.Property(e => e.DepartureDate).IsRequired();
                entity.Property(e => e.Description).IsRequired(false);

                // One-to-Many
                entity.HasOne(d => d.Trip)
                      .WithMany(t => t.Destinations)
                      .HasForeignKey(d => d.TripId)
                      .OnDelete(DeleteBehavior.Cascade); // brise destinacije ako se obrise Trip
            });

            modelBuilder.Entity<Activity>(entity =>
            {
                entity.ToTable("Activities");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Location).HasMaxLength(200);
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Planirano");
                entity.Property(e => e.Cost).HasColumnType("decimal(18,2)").HasDefaultValue(0.00m);

                // One-to-Many
                entity.HasOne(a => a.Destination)
                      .WithMany(d => d.Activities)
                      .HasForeignKey(a => a.DestinationId)
                      .OnDelete(DeleteBehavior.Cascade); // brise aktivnosti ako se obrise destinacija
            });

            modelBuilder.Entity<Expense>(entity =>
            {
                entity.ToTable("Expenses");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Description).HasMaxLength(500);

                entity.Property(e => e.Category)
                      .HasConversion<string>()
                      .HasMaxLength(50)
                      .HasDefaultValue(ExpenseCategory.Other);

                entity.Property(e => e.Currency).HasMaxLength(10).HasDefaultValue("EUR");
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Trip)
                      .WithMany(t => t.Expenses)
                      .HasForeignKey(e => e.TripId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Trip>(entity =>
            {
                entity.Property(t => t.Budget).HasColumnType("decimal(18,2)").HasDefaultValue(0.00m);
            });
        }
    }
}
