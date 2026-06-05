using Common.DTOs;
using Common.DTOs.Trip.Activity;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IActivityService : IService
    {
        Task<ApiResponseDTO<ActivityResponseDTO>> AddActivityAsync(Guid destinationId, Guid userId, ActivityCreateDTO createDto);
        Task<ApiResponseDTO<List<ActivityResponseDTO>>> GetDestinationActivitiesAsync(Guid destinationId, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<ActivityResponseDTO>> UpdateActivityAsync(Guid activityId, ActivityCreateDTO updateDto, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteActivityAsync(Guid activityId, Guid userId, string requestingUserRole);
    }
}
