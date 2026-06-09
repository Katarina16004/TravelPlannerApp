using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Common.Interfaces;
using Common.DTOs.Auth;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userServiceProxy;

        public AuthController()
        {
            _userServiceProxy = ServiceProxy.Create<IUserService>(
                new Uri("fabric:/TravelPlannerApp/UserService"));
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO registerDto)
        {
            if (registerDto == null)
            {
                return BadRequest(new LoginResponseDTO { Success = false, ErrorMessage = "Registration data is empty." });
            }

            try
            {
                var result = await _userServiceProxy.RegisterAsync(registerDto);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new LoginResponseDTO
                {
                    Success = false,
                    ErrorMessage = $"API Gateway error during registration: {ex.Message}"
                });
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDto)
        {
            if (loginDto == null)
            {
                return BadRequest(new LoginResponseDTO { Success = false, ErrorMessage = "Login data is empty." });
            }

            try
            {
                var result = await _userServiceProxy.LoginAsync(loginDto);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new LoginResponseDTO
                {
                    Success = false,
                    ErrorMessage = $"API Gateway error during login: {ex.Message}"
                });
            }
        }
    }
}