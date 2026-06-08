using System.ComponentModel.DataAnnotations;

namespace TripService.Models
{
    public class ChecklistItem
    {
        [Key]
        public Guid Id { get; set; }
        public Guid TripId { get; set; } 
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
        public virtual Trip Trip { get; set; } = null!;
    }
}
