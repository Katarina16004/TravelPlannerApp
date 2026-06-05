using Common.Enums;

namespace Common.DTOs.Trip
{
    public class TripResponseDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? Note { get; set; }
        public TripStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
