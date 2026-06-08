using Common.Enums;
using System.Runtime.Serialization;

namespace Common.DTOs.Trip.Expense
{
    [DataContract]
    public class ExpenseResponseDTO
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public Guid TripId { get; set; }
        [DataMember]
        public string Title { get; set; } = string.Empty;
        [DataMember]
        public decimal Amount { get; set; }
        [DataMember]
        public ExpenseCategory Category { get; set; }
        [DataMember]
        public string Currency { get; set; } = string.Empty;
        [DataMember]
        public DateTime Date { get; set; }
        [DataMember]
        public string? Description { get; set; }
    }
}
