using Common.DTOs;
using Common.DTOs.Trip;
using Common.DTOs.Trip.Destination;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Threading;
using System.Threading.Tasks;
using TripService.Data;
using TripService.Services;

namespace TripService
{
    internal sealed class TripService : StatelessService, ITripService, IDestinationService
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly ITripService _tripBusinessService;
        private readonly IDestinationService _destinationBusinessService;

        public TripService(StatelessServiceContext context)
            : base(context)
        {
            try
            {
                var configuration = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .Build();

                string sqlConn = "Server=.\\SQLEXPRESS;Database=TravelPlanner_TripDB;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False;";

                var services = new ServiceCollection();

                services.AddDbContext<TripDbContext>(options =>
                    options.UseSqlServer(sqlConn));

                services.AddSingleton<IConfiguration>(configuration);
                services.AddScoped<ITripService, TripBusinessService>();
                services.AddScoped<IDestinationService, DestinationBusinessService>();

                _serviceProvider = services.BuildServiceProvider();

                _tripBusinessService = _serviceProvider.GetRequiredService<ITripService>();
                _destinationBusinessService = _serviceProvider.GetRequiredService<IDestinationService>();

                ServiceEventSource.Current.ServiceMessage(this.Context, "TripService initialized successfully");
            }
            catch (Exception ex)
            {
                ServiceEventSource.Current.ServiceMessage(this.Context, $"Error: {ex.Message}");
                throw;
            }
        }
        #region TripService Methods
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
        #endregion

        #region DestinationService Methods
        public Task<ApiResponseDTO<DestinationResponseDTO>> AddDestinationAsync(Guid tripId, Guid userId, DestinationCreateDTO createDto)
        {
            return _destinationBusinessService.AddDestinationAsync(tripId, userId, createDto);
        }

        public Task<ApiResponseDTO<List<DestinationResponseDTO>>> GetTripDestinationsAsync(Guid tripId, Guid userId, string requestingUserRole)
        {
            return _destinationBusinessService.GetTripDestinationsAsync(tripId, userId, requestingUserRole);
        }

        public Task<ApiResponseDTO<DestinationResponseDTO>> UpdateDestinationAsync(Guid destinationId, DestinationCreateDTO updateDto, Guid userId, string requestingUserRole)
        {
            return _destinationBusinessService.UpdateDestinationAsync(destinationId, updateDto, userId, requestingUserRole);
        }

        public Task<ApiResponseDTO<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId, string requestingUserRole)
        {
            return _destinationBusinessService.DeleteDestinationAsync(destinationId, userId, requestingUserRole);
        }
        #endregion
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