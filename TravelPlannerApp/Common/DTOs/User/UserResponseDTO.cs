using System.Runtime.Serialization;

namespace Common.DTOs.User
{
    [DataContract]
    public class UserResponseDTO
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public string Name { get; set; } = string.Empty;
        [DataMember]
        public string Email { get; set; } = string.Empty;
        [DataMember]
        public string Role { get; set; } = string.Empty;
    }
}
