using Common.Enums;
using System.Runtime.Serialization;

namespace Common.DTOs.Trip.TripShare
{
    [DataContract]
    public class SharedTripDto
    {
        [DataMember]
        public TripResponseDTO? Trip { get; set; }

        [DataMember]
        public ShareAccessType AccessType { get; set; }
    }
}
