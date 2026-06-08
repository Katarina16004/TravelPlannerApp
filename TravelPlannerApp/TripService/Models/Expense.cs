using Common.Enums;

namespace TripService.Models
{
    public class Expense
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;
        public string Currency { get; set; } = "EUR";
        public DateTime Date { get; set; }
        public string? Description { get; set; }

        public Trip? Trip { get; set; }
    }
}
