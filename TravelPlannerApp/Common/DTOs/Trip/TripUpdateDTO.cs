using System.Runtime.Serialization;

namespace Common.DTOs.Trip
{
    [DataContract]
    public class TripUpdateDTO
    {
        [DataMember]
        public string Name { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public DateTime StartDate { get; set; }
        [DataMember]
        public DateTime EndDate { get; set; }
        [DataMember]
        public decimal Budget { get; set; }
        [DataMember]
        public string? Note { get; set; }
    }
}
