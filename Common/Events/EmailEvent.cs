using Common.DTOs.Trip.TripShare;
using System.Runtime.Serialization;

namespace Common.Events
{
    [DataContract]
    public class EmailEvent
    {
        [DataMember]
        public string Email { get; set; } = string.Empty;
        [DataMember]
        public TripShareDto? TripShareDto { get; set; }
    }
}
