using Common.DTOs;
using Common.DTOs.Trip.Destination;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IDestinationService: IService
    {
        Task<ApiResponseDTO<DestinationResponseDTO>> AddDestinationAsync(Guid tripId, Guid userId, DestinationCreateDTO createDto);
        Task<ApiResponseDTO<List<DestinationResponseDTO>>> GetTripDestinationsAsync(Guid tripId, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<DestinationResponseDTO>> UpdateDestinationAsync(Guid destinationId, DestinationCreateDTO updateDto, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId, string requestingUserRole);
    }
}