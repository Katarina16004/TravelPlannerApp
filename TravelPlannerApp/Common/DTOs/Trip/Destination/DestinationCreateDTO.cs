using System.Runtime.Serialization;

namespace Common.DTOs.Trip.Destination
{
    [DataContract]
    public class DestinationCreateDTO
    {
        [DataMember]
        public string Name { get; set; } = string.Empty;
        [DataMember]
        public string Location { get; set; } = string.Empty;
        [DataMember]
        public DateTime ArrivalDate { get; set; }
        [DataMember]
        public DateTime DepartureDate { get; set; }
        [DataMember]
        public string? Description { get; set; }
    }
}
