using Common.Enums;
using System.ComponentModel.DataAnnotations;

namespace TripService.Models
{
    public class TripShare
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripId { get; set; }

        public Trip? Trip { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        public ShareAccessType AccessType { get; set; }

        public DateTime ExpiresAt { get; set; }
        public string QrCodeBase64 { get; set; } = string.Empty;
    }
}
