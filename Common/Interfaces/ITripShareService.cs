using Common.DTOs;
using Common.DTOs.Trip.TripShare;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface ITripShareService:IService
    {
        Task<ApiResponseDTO<TripShareDto>> CreateShareAsync(CreateTripShareDto dto, Guid userId);
        Task<ApiResponseDTO<SharedTripDto>> GetSharedTripAsync(string token);
        Task<ApiResponseDTO<IEnumerable<TripShareDto>>> GetSharesByTripIdAsync(Guid tripId, Guid userId);
        Task<ApiResponseDTO<bool>> RevokeShareAsync(Guid id, Guid userId);

    }
}
