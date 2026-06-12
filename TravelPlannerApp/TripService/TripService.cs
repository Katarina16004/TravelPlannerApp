using Common.DTOs;
using Common.DTOs.Trip;
using Common.DTOs.Trip.Activity;
using Common.DTOs.Trip.CheckList;
using Common.DTOs.Trip.Destination;
using Common.DTOs.Trip.Expense;
using Common.DTOs.Trip.TripShare;
using Common.Enums;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;
using TripService.Data;
using TripService.Services;

namespace TripService
{
    internal sealed class TripService : StatelessService, ITripService, IDestinationService, IActivityService, IExpenseService,
        IChecklistService, ITripShareService
    {
        private readonly ServiceProvider _serviceProvider;
        private readonly ITripService _tripBusinessService;
        private readonly IDestinationService _destinationBusinessService;
        private readonly IActivityService _activityBusinessService;
        private readonly IExpenseService _expenseBusinessService;
        private readonly IChecklistService _ckecklistBusinessService;
        private readonly ITripShareService _tripShareBusinessService;

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
                services.AddScoped<IActivityService, ActivityBusinessService>();
                services.AddScoped<IExpenseService, ExpenseBusinessService>();
                services.AddScoped<IChecklistService, ChecklistBusinessService>();
                services.AddScoped<ITripShareService, TripShareBusinessService>();

                _serviceProvider = services.BuildServiceProvider();

                _tripBusinessService = _serviceProvider.GetRequiredService<ITripService>();
                _destinationBusinessService = _serviceProvider.GetRequiredService<IDestinationService>();
                _activityBusinessService = _serviceProvider.GetRequiredService<IActivityService>();
                _expenseBusinessService = _serviceProvider.GetRequiredService<IExpenseService>();
                _ckecklistBusinessService= _serviceProvider.GetRequiredService<IChecklistService>();
                _tripShareBusinessService= _serviceProvider.GetRequiredService<ITripShareService>();


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
        {
            return _tripBusinessService.CreateTripAsync(userId, createDto);
        }

        public Task<ApiResponseDTO<TripResponseDTO>> GetTripByIdAsync(Guid tripId, Guid userId, string? sharingToken)
        {
            return _tripBusinessService.GetTripByIdAsync(tripId, userId, sharingToken);
        }

        public Task<ApiResponseDTO<List<TripResponseDTO>>> GetUserTripsAsync(Guid userId)
        {
            return _tripBusinessService.GetUserTripsAsync(userId);
        }

        public Task<ApiResponseDTO<TripResponseDTO>> UpdateTripAsync(Guid tripId, TripUpdateDTO updateDto, Guid userId, string? sharingToken, string requestingUserRole)
        {
            return _tripBusinessService.UpdateTripAsync(tripId, updateDto, userId, sharingToken, requestingUserRole);
        }

        public Task<ApiResponseDTO<bool>> DeleteTripAsync(Guid tripId, Guid userId, string requestingUserRole)
        {
            return _tripBusinessService.DeleteTripAsync(tripId, userId, requestingUserRole);
        }
        
        public Task<ApiResponseDTO<List<TripResponseDTO>>> GetAllTripsAdminAsync(Guid requestingUserId, string requestingUserRole)
        {
            return _tripBusinessService.GetAllTripsAdminAsync(requestingUserId, requestingUserRole);
        }
        #endregion

        #region DestinationService Methods
        public Task<ApiResponseDTO<DestinationResponseDTO>> AddDestinationAsync(Guid tripId, Guid userId, string? sharingToken, DestinationCreateDTO createDto)
        {
            return _destinationBusinessService.AddDestinationAsync(tripId, userId, sharingToken, createDto);
        }

        public Task<ApiResponseDTO<List<DestinationResponseDTO>>> GetTripDestinationsAsync(Guid tripId, Guid userId, string? sharingToken, string requestingUserRole)
        {
            return _destinationBusinessService.GetTripDestinationsAsync(tripId, userId, sharingToken, requestingUserRole);
        }

        public Task<ApiResponseDTO<DestinationResponseDTO>> UpdateDestinationAsync(Guid destinationId, DestinationCreateDTO updateDto, string? sharingToken, Guid userId, string requestingUserRole)
        {
            return _destinationBusinessService.UpdateDestinationAsync(destinationId, updateDto, sharingToken, userId, requestingUserRole);
        }

        public Task<ApiResponseDTO<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId, string? sharingToken, string requestingUserRole)
        {
            return _destinationBusinessService.DeleteDestinationAsync(destinationId, userId, sharingToken, requestingUserRole);
        }
        #endregion

        #region ActivityService Methods
        public Task<ApiResponseDTO<ActivityResponseDTO>> AddActivityAsync(Guid destinationId, Guid userId, string? sharingToken, ActivityCreateDTO createDto)
        {
            return _activityBusinessService.AddActivityAsync(destinationId, userId, sharingToken, createDto);
        }

        public Task<ApiResponseDTO<List<ActivityResponseDTO>>> GetDestinationActivitiesAsync(Guid destinationId, Guid userId, string? sharingToken, string requestingUserRole)
        {
            return _activityBusinessService.GetDestinationActivitiesAsync(destinationId, userId, sharingToken, requestingUserRole);
        }

        public Task<ApiResponseDTO<ActivityResponseDTO>> UpdateActivityAsync(Guid activityId, string? sharingToken, ActivityCreateDTO updateDto, Guid userId, string requestingUserRole)
        {
            return _activityBusinessService.UpdateActivityAsync(activityId, sharingToken, updateDto, userId, requestingUserRole);
        }

        public Task<ApiResponseDTO<bool>> DeleteActivityAsync(Guid activityId, string? sharingToken, Guid userId, string requestingUserRole)
        {
            return _activityBusinessService.DeleteActivityAsync(activityId, sharingToken, userId, requestingUserRole);
        }
        #endregion

        #region ExpenseService Methods
        public Task<ApiResponseDTO<ExpenseResponseDTO>> AddExpenseAsync(Guid tripId, Guid userId, string? sharingToken, ExpenseCreateDTO createDto)
        {
            return _expenseBusinessService.AddExpenseAsync(tripId, userId, sharingToken, createDto);
        }

        public Task<ApiResponseDTO<List<ExpenseResponseDTO>>> GetTripExpensesAsync(Guid tripId, Guid userId, string? sharingToken, string requestingUserRole)
        {
            return _expenseBusinessService.GetTripExpensesAsync(tripId, userId, sharingToken, requestingUserRole);
        }

        public Task<ApiResponseDTO<BudgetSummaryDTO>> GetBudgetSummaryAsync(Guid tripId, Guid userId, string? sharingToken)
        {
            return _expenseBusinessService.GetBudgetSummaryAsync(tripId, userId, sharingToken);
        }

        public Task<ApiResponseDTO<bool>> DeleteExpenseAsync(Guid expenseId, Guid userId, string? sharingToken, string requestingUserRole)
        {
            return _expenseBusinessService.DeleteExpenseAsync(expenseId, userId, sharingToken, requestingUserRole);
        }

        #endregion

        #region ChecklistService Methods
        public Task<ApiResponseDTO<ChecklistResponseDTO>> AddItemAsync(Guid tripId, Guid userId, ChecklistCreateDTO createDto)
        {
            return _ckecklistBusinessService.AddItemAsync(tripId, userId, createDto);
        }

        public Task<ApiResponseDTO<List<ChecklistResponseDTO>>> GetTripItemsAsync(Guid tripId, Guid userId)
        {
            return _ckecklistBusinessService.GetTripItemsAsync(tripId, userId);
        }

        public Task<ApiResponseDTO<bool>> ToggleItemAsync(Guid itemId, Guid userId)
        {
            return _ckecklistBusinessService.ToggleItemAsync(itemId, userId);
        }

        public Task<ApiResponseDTO<bool>> DeleteItemAsync(Guid itemId, Guid userId)
        {
            return _ckecklistBusinessService.DeleteItemAsync(itemId, userId);
        }
        #endregion

        #region TripShareService Methods

        public Task<ApiResponseDTO<TripShareDto>> CreateShareAsync(CreateTripShareDto dto, Guid userId)
        {
            return _tripShareBusinessService.CreateShareAsync(dto, userId);
        }

        public Task<ApiResponseDTO<SharedTripDto>> GetSharedTripAsync(string token)
        {
            return _tripShareBusinessService.GetSharedTripAsync(token);
        }

        public Task<ApiResponseDTO<IEnumerable<TripShareDto>>> GetSharesByTripIdAsync(Guid tripId, Guid userId)
        {
            return _tripShareBusinessService.GetSharesByTripIdAsync(tripId, userId);
        }

        public Task<ApiResponseDTO<bool>> RevokeShareAsync(Guid id, Guid userId)
        {
            return _tripShareBusinessService.RevokeShareAsync(id, userId);
        }
        public Task<ShareAccessType?> GetAccessTypeAsync(string token)
        {
            return _tripShareBusinessService.GetAccessTypeAsync(token);
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