using Common.Enums;

namespace Common.DTOs.Trip.Expense
{
    public class ExpenseResponseDTO
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public ExpenseCategory Category { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Description { get; set; }
    }
}
