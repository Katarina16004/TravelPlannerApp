using System.Runtime.Serialization;

namespace Common.DTOs.Auth
{
    [DataContract]
    public class LoginResponseDTO
    {
        [DataMember]
        public bool Success { get; set; }
        [DataMember]
        public string Token { get; set; }= string.Empty;
        [DataMember]
        public string ErrorMessage { get; set; }= string.Empty;
        [DataMember]
        public string Role { get; set; }= string.Empty;
    }
}
