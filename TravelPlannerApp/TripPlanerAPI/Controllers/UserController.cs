using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Common.DTOs;
using Common.DTOs.User;
using Common.Interfaces;
using System.Security.Claims;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userServiceProxy;

        public UserController()
        {
            _userServiceProxy = ServiceProxy.Create<IUserService>(
                new Uri("fabric:/TravelPlannerApp/UserService"));
        }

        // GET: api/user/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUser(Guid id)
        {
            try
            {
                var result = await _userServiceProxy.GetUserByIdAsync(id);

                if (!result.Success)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<UserResponseDTO>
                {
                    Success = false,
                    Message = $"Error retrieving user: {ex.Message}"
                });
            }
        }

        // GET: api/user
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var result = await _userServiceProxy.GetAllUsersAsync();

                if (!result.Success)
                {
                    return StatusCode(500, result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<List<UserResponseDTO>>
                {
                    Success = false,
                    Message = $"Error retrieving users: {ex.Message}"
                });
            }
        }

        // PUT: api/user/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateDTO updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest(new ApiResponseDTO<UserResponseDTO>
                {
                    Success = false,
                    Message = "Update data is empty."
                });
            }

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);

                if (userIdClaim == null || roleClaim == null)
                {
                    return Unauthorized(new ApiResponseDTO<UserResponseDTO>
                    {
                        Success = false,
                        Message = "Invalid token."
                    });
                }

                Guid requestingUserId = Guid.Parse(userIdClaim.Value);
                string requestingUserRole = roleClaim.Value;

                var result = await _userServiceProxy.UpdateUserAsync(id, updateDto, requestingUserId, requestingUserRole);

                if (!result.Success)
                {
                    return Forbid();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<UserResponseDTO>
                {
                    Success = false,
                    Message = $"Error updating user: {ex.Message}"
                });
            }
        }

        // DELETE: api/user/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);

                if (userIdClaim == null || roleClaim == null)
                {
                    return Unauthorized(new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Invalid token."
                    });
                }

                Guid requestingUserId = Guid.Parse(userIdClaim.Value);
                string requestingUserRole = roleClaim.Value;

                var result = await _userServiceProxy.DeleteUserAsync(id, requestingUserId, requestingUserRole);

                if (!result.Success)
                {
                    return Forbid();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Error deleting user: {ex.Message}"
                });
            }
        }
    }
}