using Common.DTOs.Trip.Activity;
using TripService.Models;

namespace TripService.Mappers
{
    public static class ActivityMapper
    {
        public static ActivityResponseDTO MapToResponseDto(Activity activity)
        {
            return new ActivityResponseDTO
            {
                Id = activity.Id,
                DestinationId = activity.DestinationId,
                Name = activity.Name,
                Description = activity.Description,
                Location = activity.Location,
                StartTime = activity.StartTime,
                EndTime = activity.EndTime,
                Cost = activity.Cost,
                Status = activity.Status
            };
        }
    }
}
