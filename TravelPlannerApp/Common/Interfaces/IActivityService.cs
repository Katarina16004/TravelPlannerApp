using Common.DTOs;
using Common.DTOs.Trip.Activity;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IActivityService : IService
    {
        Task<ApiResponseDTO<ActivityResponseDTO>> AddActivityAsync(Guid destinationId, Guid userId, string? sharingToken, ActivityCreateDTO createDto, string requestingUserRole);
        Task<ApiResponseDTO<List<ActivityResponseDTO>>> GetDestinationActivitiesAsync(Guid destinationId, Guid userId, string? sharingToken, string requestingUserRole);
        Task<ApiResponseDTO<ActivityResponseDTO>> UpdateActivityAsync(Guid activityId, string? sharingToken, ActivityCreateDTO updateDto, Guid userId, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteActivityAsync(Guid activityId, string? sharingToken, Guid userId, string requestingUserRole);
    }
}
