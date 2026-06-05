using Common.Enums;

namespace TripService.Models
{
    public class Trip
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public TripStatus Status { get; set; } = TripStatus.Planning;
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
