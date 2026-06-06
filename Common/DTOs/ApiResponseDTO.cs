using System.Runtime.Serialization;

namespace Common.DTOs
{
    [DataContract]
    public class ApiResponseDTO<T>
    {
        [DataMember]
        public bool Success { get; set; }
        [DataMember]
        public T? Data { get; set; }
        [DataMember]
        public string Message { get; set; } = string.Empty;
    }
}
