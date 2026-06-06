using Common.Enums;
using System.Runtime.Serialization;

namespace Common.DTOs.Trip.Expense
{
    [DataContract]
    public class ExpenseCreateDTO
    {
        [DataMember]
        public string Title { get; set; } = string.Empty;
        [DataMember]
        public decimal Amount { get; set; }
        [DataMember]
        public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;
        [DataMember]
        public string Currency { get; set; } = "EUR";
        [DataMember]
        public DateTime Date { get; set; }
        [DataMember]
        public string? Description { get; set; }

    }
}
