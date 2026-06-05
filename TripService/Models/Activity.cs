using Common.Enums;

namespace TripService.Models
{
    public class Activity
    {
        public Guid Id { get; set; }
        public Guid DestinationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal Cost { get; set; }
        public ActivityStatus Status { get; set; } = ActivityStatus.Planned;
        public Destination? Destination { get; set; }
    }
}
