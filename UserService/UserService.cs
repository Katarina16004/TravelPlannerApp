using Common.DTOs;
using Common.DTOs.Auth;
using Common.DTOs.User;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;
using UserService.Data;
using UserService.Services;

namespace UserService
{
    internal sealed class UserService : StatelessService, IUserService
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly IUserService _userBusinessService;

        public UserService(StatelessServiceContext context)
            : base(context)
        {
            try
            {
                var configuration = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .Build();

                string sqlConn = "Server=.\\SQLEXPRESS;Database=TravelPlanner_UserDB;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False;";

                var services = new ServiceCollection();

                services.AddDbContext<UserDbContext>(options =>
                    options.UseSqlServer(sqlConn));

                services.AddSingleton<IConfiguration>(configuration);
                services.AddScoped<IUserService, UserBusinessService>();

                _serviceProvider = services.BuildServiceProvider();
                _userBusinessService = _serviceProvider.GetRequiredService<IUserService>();

                ServiceEventSource.Current.ServiceMessage(this.Context, "UserService initialized successfully");
            }
            catch (Exception ex)
            {
                ServiceEventSource.Current.ServiceMessage(this.Context, $"Error: {ex.Message}");
                throw;
            }
        }

        public Task<LoginResponseDTO> RegisterAsync(UserRegisterDTO registerDto)
        {
            return _userBusinessService.RegisterAsync(registerDto);
        }

        public Task<LoginResponseDTO> LoginAsync(UserLoginDTO loginDto)
        {
            return _userBusinessService.LoginAsync(loginDto);
        }
        public Task<ApiResponseDTO<UserResponseDTO>> GetUserByIdAsync(Guid userId)
        {
            return _userBusinessService.GetUserByIdAsync(userId);
        }

        public Task<ApiResponseDTO<List<UserResponseDTO>>> GetAllUsersAsync()
        {
            return _userBusinessService.GetAllUsersAsync();
        }

        public Task<ApiResponseDTO<UserResponseDTO>> UpdateUserAsync(Guid userId, UserUpdateDTO updateDto, Guid requestingUserId, string requestingUserRole)
        {
            return _userBusinessService.UpdateUserAsync(userId, updateDto, requestingUserId, requestingUserRole);
        }

        public Task<ApiResponseDTO<bool>> DeleteUserAsync(Guid userId, Guid requestingUserId, string requestingUserRole)
        {
            return _userBusinessService.DeleteUserAsync(userId, requestingUserId, requestingUserRole);
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
            }
        }
    }
}