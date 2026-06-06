using System.Runtime.Serialization;

namespace Common.DTOs.Trip.Expense
{
    [DataContract]
    public class BudgetSummaryDTO
    {
        [DataMember]
        public decimal Budget { get; set; }
        [DataMember]
        public decimal TotalSpent { get; set; }
        [DataMember]
        public decimal Remaining { get; set; }
        [DataMember]
        public bool IsOverBudget { get; set; }
    }

}
