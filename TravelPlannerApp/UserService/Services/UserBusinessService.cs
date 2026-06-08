using Common.DTOs;
using Common.DTOs.Auth;
using Common.DTOs.User;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserService.Data;
using UserService.Mappers;
using UserService.Models;

namespace UserService.Services
{
    public class UserBusinessService : IUserService
    {
        private readonly UserDbContext _context;

        public UserBusinessService(UserDbContext context)
        {
            _context = context;
        }

        #region Auth
        public async Task<LoginResponseDTO> RegisterAsync(UserRegisterDTO registerDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(registerDto.Name) ||
                    string.IsNullOrWhiteSpace(registerDto.Email) ||
                    string.IsNullOrWhiteSpace(registerDto.Password))
                {
                    return new LoginResponseDTO
                    {
                        Success = false,
                        ErrorMessage = "All fields are required."
                    };
                }

                if (registerDto.Password.Length < 6)
                {
                    return new LoginResponseDTO
                    {
                        Success = false,
                        ErrorMessage = "Password must have more than 5 symbols."
                    };
                }

                var existingUser = await _context.Users.AnyAsync(u => u.Email == registerDto.Email);
                if (existingUser)
                {
                    return new LoginResponseDTO
                    {
                        Success = false,
                        ErrorMessage = "User with this email already exists."
                    };
                }

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                var newUser = new User
                {
                    Id = Guid.NewGuid(),
                    Name = registerDto.Name,
                    Email = registerDto.Email,
                    PasswordHash = hashedPassword,
                    Role = "User"
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                string token = GenerateJwtToken(newUser);

                return new LoginResponseDTO
                {
                    Success = true,
                    Token = token,
                    Role = newUser.Role
                };
            }
            catch (Exception ex)
            {
                string innerErrorMsg = ex.InnerException?.Message ?? "No inner exception";
                return new LoginResponseDTO
                {
                    Success = false,
                    ErrorMessage = $"Error with registration: {ex.Message} | Inner: {innerErrorMsg}"
                };
            }
        }

        public async Task<LoginResponseDTO> LoginAsync(UserLoginDTO loginDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(loginDto.Email) ||
                    string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    return new LoginResponseDTO
                    {
                        Success = false,
                        ErrorMessage = "Email and password are required."
                    };
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                if (user == null)
                {
                    return new LoginResponseDTO
                    {
                        Success = false,
                        ErrorMessage = "Invalid email or password."
                    };
                }

                bool passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);

                if (!passwordValid)
                {
                    return new LoginResponseDTO
                    {
                        Success = false,
                        ErrorMessage = $"Invalid email or password. [Hash: {user.PasswordHash}]"
                    };
                }

                string token = GenerateJwtToken(user);

                return new LoginResponseDTO
                {
                    Success = true,
                    Token = token,
                    Role = user.Role
                };
            }
            catch (Exception ex)
            {
                return new LoginResponseDTO
                {
                    Success = false,
                    ErrorMessage = $"Error with login: {ex.Message}"
                };
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("neki-random-string-od-32+-karaktera");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(60),
                Issuer = "ProjekatWeb",
                Audience = "ProjekatWeb",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        #endregion

        #region CRUD Operations

        public async Task<ApiResponseDTO<UserResponseDTO>> GetUserByIdAsync(Guid userId)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return new ApiResponseDTO<UserResponseDTO>
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }

                var userResponseDTO = UserMapper.MapToResponseDto(user);

                return new ApiResponseDTO<UserResponseDTO>
                {
                    Success = true,
                    Data = userResponseDTO,
                    Message = "User retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<UserResponseDTO>
                {
                    Success = false,
                    Message = $"Error retrieving user: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDTO<List<UserResponseDTO>>> GetAllUsersAsync()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                var userResponsesDtos = users.Select(UserMapper.MapToResponseDto).ToList();

                return new ApiResponseDTO<List<UserResponseDTO>>
                {
                    Success = true,
                    Data = userResponsesDtos,
                    Message = $"Found {userResponsesDtos.Count} users."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<UserResponseDTO>>
                {
                    Success = false,
                    Message = $"Error retrieving users: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDTO<UserResponseDTO>> UpdateUserAsync(Guid userId, UserUpdateDTO updateDto, Guid requestingUserId, string requestingUserRole)
        {
            try
            {
                if (requestingUserId != userId && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<UserResponseDTO>
                    {
                        Success = false,
                        Message = "You do not have permission to update this user."
                    };
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return new ApiResponseDTO<UserResponseDTO>
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }

                if (string.IsNullOrWhiteSpace(updateDto.Name) || string.IsNullOrWhiteSpace(updateDto.Email))
                {
                    return new ApiResponseDTO<UserResponseDTO>
                    {
                        Success = false,
                        Message = "Name and email are required."
                    };
                }

                if (updateDto.Email != user.Email)
                {
                    var existingUser = await _context.Users.AnyAsync(u => u.Email == updateDto.Email);
                    if (existingUser)
                    {
                        return new ApiResponseDTO<UserResponseDTO>
                        {
                            Success = false,
                            Message = "Email is already in use."
                        };
                    }
                }

                user.Name = updateDto.Name;
                user.Email = updateDto.Email;

                if (!string.IsNullOrWhiteSpace(updateDto.NewPassword))
                {
                    if (string.IsNullOrWhiteSpace(updateDto.CurrentPassword))
                    {
                        return new ApiResponseDTO<UserResponseDTO>
                        {
                            Success = false,
                            Message = "Current password is required to change password."
                        };
                    }

                    bool currentPasswordValid = BCrypt.Net.BCrypt.Verify(updateDto.CurrentPassword, user.PasswordHash);
                    if (!currentPasswordValid)
                    {
                        return new ApiResponseDTO<UserResponseDTO>
                        {
                            Success = false,
                            Message = "Current password is incorrect."
                        };
                    }

                    if (updateDto.NewPassword.Length < 6)
                    {
                        return new ApiResponseDTO<UserResponseDTO>
                        {
                            Success = false,
                            Message = "New password must have at least 6 characters."
                        };
                    }

                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.NewPassword);
                }

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                var userResponseDTO = UserMapper.MapToResponseDto(user);

                return new ApiResponseDTO<UserResponseDTO>
                {
                    Success = true,
                    Data = userResponseDTO,
                    Message = "User updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<UserResponseDTO>
                {
                    Success = false,
                    Message = $"Error updating user: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> DeleteUserAsync(Guid userId, Guid requestingUserId, string requestingUserRole)
        {
            try
            {
                if (requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "You do not have permission to delete this user."
                    };
                }
                if (userId == requestingUserId)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Admin cannot delete their own account."
                    };
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool>
                {
                    Success = true,
                    Data = true,
                    Message = "User deleted successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Error deleting user: {ex.Message}"
                };
            }
        }
        #endregion
    }
}