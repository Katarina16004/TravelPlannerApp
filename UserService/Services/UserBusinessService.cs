using Common.DTOs;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserService.Data;
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
    }
}