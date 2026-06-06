using System.Runtime.Serialization;

namespace Common.DTOs.Trip.CheckList
{
    [DataContract]
    public class ChecklistCreateDTO
    {
        [DataMember]
        public string Title { get; set; } = string.Empty;
    }
}
