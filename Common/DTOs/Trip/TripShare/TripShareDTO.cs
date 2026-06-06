using Common.Enums;
using System.Runtime.Serialization;

namespace Common.DTOs.Trip.TripShare
{
    [DataContract]
    public class TripShareDto
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public Guid TripId { get; set; }
        [DataMember]
        public string Token { get; set; } = string.Empty;
        [DataMember]
        public ShareAccessType AccessType { get; set; }
        [DataMember]
        public DateTime ExpiresAt { get; set; }
        [DataMember]
        public string QrCodeBase64 { get; set; } = string.Empty;

    }
}
