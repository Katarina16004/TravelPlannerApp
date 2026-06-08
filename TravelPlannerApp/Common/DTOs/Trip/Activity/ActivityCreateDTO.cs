using Common.Enums;
using System.Runtime.Serialization;

namespace Common.DTOs.Trip.Activity
{
    [DataContract]
    public class ActivityCreateDTO
    {
        [DataMember]
        public string Name { get; set; } = string.Empty;
        [DataMember] 
        public string Description { get; set; } = string.Empty;
        [DataMember]        
        public string Location { get; set; } = string.Empty;
        [DataMember]
        public DateTime StartTime { get; set; }
        [DataMember]
        public DateTime EndTime { get; set; }
        [DataMember]
        public decimal Cost { get; set; }
        [DataMember]
        public ActivityStatus Status { get; set; }
    }
}
