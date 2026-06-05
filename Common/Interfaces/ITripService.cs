using Common.DTOs;
using Common.DTOs.Trip;
using Common.DTOs.Trip.Destination;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface ITripService:IService
    {
        Task<ApiResponseDTO<TripResponseDTO>> CreateTripAsync(Guid userId, TripCreateDTO createDto);
        Task<ApiResponseDTO<TripResponseDTO>> GetTripByIdAsync(Guid tripId, Guid userId);
        Task<ApiResponseDTO<List<TripResponseDTO>>> GetUserTripsAsync(Guid userId);
        Task<ApiResponseDTO<TripResponseDTO>> UpdateTripAsync(Guid tripId, TripUpdateDTO updateDto, Guid userId);
        Task<ApiResponseDTO<bool>> DeleteTripAsync(Guid tripId, Guid userId);

        Task<ApiResponseDTO<DestinationResponseDTO>> AddDestinationAsync(Guid tripId, Guid userId, DestinationCreateDTO createDto);
        Task<ApiResponseDTO<List<DestinationResponseDTO>>> GetTripDestinationsAsync(Guid tripId, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<DestinationResponseDTO>> UpdateDestinationAsync(Guid destinationId, DestinationCreateDTO updateDto, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId, string requestingUserRole);
    }
}
