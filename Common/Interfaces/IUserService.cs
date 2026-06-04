using Common.DTOs;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IUserService:IService
    {
        Task<LoginResponseDTO> RegisterAsync(UserRegisterDTO registerDto);
        Task<LoginResponseDTO> LoginAsync(UserLoginDTO loginDto);
    }
}
