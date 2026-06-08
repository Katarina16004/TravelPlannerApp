using System.Runtime.Serialization;

namespace Common.DTOs.User
{
    [DataContract]
    public class UserUpdateDTO
    {
        [DataMember]
        public string Name { get; set; } = string.Empty;
        [DataMember]
        public string Email { get; set; } = string.Empty;
        [DataMember]            
        public string? CurrentPassword { get; set; } = string.Empty;
        [DataMember] 
        public string? NewPassword { get; set; } = string.Empty;
    }
}
