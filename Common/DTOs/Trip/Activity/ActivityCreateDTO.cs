using Common.Enums;

namespace Common.DTOs.Trip.Activity
{
    public class ActivityCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal Cost { get; set; }
        public ActivityStatus Status { get; set; }
    }
}
