namespace Common.DTOs.Trip.Expense
{
    public class BudgetSummaryDTO
    {
        public decimal Budget { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal Remaining { get; set; }
        public bool IsOverBudget { get; set; }
    }

}
