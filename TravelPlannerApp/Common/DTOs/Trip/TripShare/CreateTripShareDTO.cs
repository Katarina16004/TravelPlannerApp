using Common.Enums;
using System.Runtime.Serialization;

namespace Common.DTOs.Trip.TripShare
{

    [DataContract]
    public class CreateTripShareDto
    {
        [DataMember]
        public Guid TripId { get; set; }

        [DataMember]
        public ShareAccessType AccessType { get; set; }

        [DataMember]
        public int ExpiresInDays { get; set; }

        [DataMember]
        public string Email { get; set; } = string.Empty;
    }

}
