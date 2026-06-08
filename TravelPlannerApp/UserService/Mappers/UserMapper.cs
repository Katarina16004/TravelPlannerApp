using Common.DTOs.User;
using UserService.Models;

namespace UserService.Mappers
{
    public static class UserMapper
    {
        public static UserResponseDTO MapToResponseDto(User user)
        {
            return new UserResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
