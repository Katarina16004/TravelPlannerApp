using System.Runtime.Serialization;

namespace Common.DTOs.Auth
{
    [DataContract]
    public class UserLoginDTO
    {
        [DataMember]
        public string Email { get; set; }= string.Empty;
        [DataMember]
        public string Password { get; set; }= string.Empty;
    }
}
