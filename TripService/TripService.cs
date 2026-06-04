using System;
using System.Collections.Generic;
using System.Fabric;
using System.Threading;
using System.Threading.Tasks;
using Common.Interfaces;
using Common.DTOs;
using Common.DTOs.Trip;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using TripService.Data;
using TripService.Services;

namespace TripService
{
    internal sealed class TripService : StatelessService, ITripService
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly ITripService _tripBusinessService;

        public TripService(StatelessServiceContext context)
            : base(context)
        {
            try
            {
                var configuration = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .Build();

                string sqlConn = "Server=.\\SQLEXPRESS;Database=TravelPlanner_UserDB;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False;";

                var services = new ServiceCollection();

                services.AddDbContext<TripDbContext>(options =>
                    options.UseSqlServer(sqlConn));

                services.AddSingleton<IConfiguration>(configuration);
                services.AddScoped<ITripService, TripBusinessService>();

                _serviceProvider = services.BuildServiceProvider();

                using (var scope = _serviceProvider.CreateScope())
                {
                    _tripBusinessService = scope.ServiceProvider.GetRequiredService<ITripService>();
                }
            }
            catch (Exception ex)
            {
                ServiceEventSource.Current.ServiceMessage(context, $"TripService initialization failed: {ex.Message}");
                throw;
            }
        }

        public Task<ApiResponseDTO<TripResponseDTO>> CreateTripAsync(Guid userId, TripCreateDTO createDto)
            => _tripBusinessService.CreateTripAsync(userId, createDto);

        public Task<ApiResponseDTO<TripResponseDTO>> GetTripByIdAsync(Guid tripId, Guid userId)
            => _tripBusinessService.GetTripByIdAsync(tripId, userId);

        public Task<ApiResponseDTO<List<TripResponseDTO>>> GetUserTripsAsync(Guid userId)
            => _tripBusinessService.GetUserTripsAsync(userId);

        public Task<ApiResponseDTO<TripResponseDTO>> UpdateTripAsync(Guid tripId, TripUpdateDTO updateDto, Guid userId)
            => _tripBusinessService.UpdateTripAsync(tripId, updateDto, userId);

        public Task<ApiResponseDTO<bool>> DeleteTripAsync(Guid tripId, Guid userId)
            => _tripBusinessService.DeleteTripAsync(tripId, userId);

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