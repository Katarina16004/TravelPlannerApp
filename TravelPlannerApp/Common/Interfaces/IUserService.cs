using Common.DTOs;
using Common.DTOs.Auth;
using Common.DTOs.User;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IUserService:IService
    {
        #region Authentication
        Task<LoginResponseDTO> RegisterAsync(UserRegisterDTO registerDto);
        Task<LoginResponseDTO> LoginAsync(UserLoginDTO loginDto);
        #endregion

        #region CRUD Operations
        Task<ApiResponseDTO<UserResponseDTO>> GetUserByIdAsync(Guid userId);
        Task<ApiResponseDTO<List<UserResponseDTO>>> GetAllUsersAsync();
        Task<ApiResponseDTO<UserResponseDTO>> UpdateUserAsync(Guid userId, UserUpdateDTO updateDto, Guid requestingUserId, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteUserAsync(Guid userId, Guid requestingUserId, string requestingUserRole);
        #endregion
    }
}
