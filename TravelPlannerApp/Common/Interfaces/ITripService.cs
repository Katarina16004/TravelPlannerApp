using Common.DTOs;
using Common.DTOs.Trip;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface ITripService:IService
    {
        Task<ApiResponseDTO<TripResponseDTO>> CreateTripAsync(Guid userId, TripCreateDTO createDto);
        Task<ApiResponseDTO<TripResponseDTO>> GetTripByIdAsync(Guid tripId, Guid userId, string? sharingToken);
        Task<ApiResponseDTO<List<TripResponseDTO>>> GetUserTripsAsync(Guid userId);
        Task<ApiResponseDTO<TripResponseDTO>> UpdateTripAsync(Guid tripId, TripUpdateDTO updateDto, Guid userId, string? sharingToken, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteTripAsync(Guid tripId, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<List<TripResponseDTO>>> GetAllTripsAdminAsync(Guid requestingUserId, string requestingUserRole);

    }
}
