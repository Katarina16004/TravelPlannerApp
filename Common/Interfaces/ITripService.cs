using Common.DTOs;
using Common.DTOs.Trip;

namespace Common.Interfaces
{
    public interface ITripService
    {
        Task<ApiResponseDTO<TripResponseDTO>> CreateTripAsync(Guid userId, TripCreateDTO createDto);
        Task<ApiResponseDTO<TripResponseDTO>> GetTripByIdAsync(Guid tripId, Guid userId);
        Task<ApiResponseDTO<List<TripResponseDTO>>> GetUserTripsAsync(Guid userId);
        Task<ApiResponseDTO<TripResponseDTO>> UpdateTripAsync(Guid tripId, TripUpdateDTO updateDto, Guid userId);
        Task<ApiResponseDTO<bool>> DeleteTripAsync(Guid tripId, Guid userId);
    }
}
