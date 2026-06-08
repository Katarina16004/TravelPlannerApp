using System.Runtime.Serialization;

namespace Common.DTOs.Trip.CheckList
{
    [DataContract]
    public class ChecklistResponseDTO
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public string Title { get; set; } = string.Empty;
        [DataMember]
        public bool IsCompleted { get; set; }
    }
}
