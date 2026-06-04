namespace Common.DTOs
{
    public class LoginResponseDTO
    {
        public bool Success { get; set; }
        public string Token { get; set; }= string.Empty;
        public string ErrorMessage { get; set; }= string.Empty;
        public string Role { get; set; }= string.Empty;
    }
}
