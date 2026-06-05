using Common.Enums;

namespace Common.DTOs.Trip.Expense
{
    public class ExpenseCreateDTO
    {
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;
        public string Currency { get; set; } = "EUR";
        public DateTime Date { get; set; }
        public string? Description { get; set; }

    }
}
