using Common.DTOs;
using Common.DTOs.Trip.Activity;
using Common.DTOs.Trip.Destination;
using Common.Enums;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Mappers;
using TripService.Models;

namespace TripService.Services
{
    public class ActivityBusinessService : IActivityService
    {
        private readonly TripDbContext _context;
        private readonly ITripShareService _tripShareService;

        public ActivityBusinessService(TripDbContext context, ITripShareService tripShareService)
        {
            _context = context;
            _tripShareService = tripShareService;
        }
        private async Task<bool> HasAccess(Trip trip, Guid userId, string? token, ShareAccessType requiredAccess)
        {
            if (trip.UserId == userId) return true;

            if (string.IsNullOrEmpty(token)) return false;

            var accessType = await _tripShareService.GetAccessTypeAsync(token);

            if (accessType == null) return false;

            if (accessType == ShareAccessType.Edit) return true;
            if (requiredAccess == ShareAccessType.View && accessType == ShareAccessType.View) return true;

            return false;
        }

        public async Task<ApiResponseDTO<ActivityResponseDTO>> AddActivityAsync(Guid destinationId, Guid userId, string? token, ActivityCreateDTO createDto)
        {
            try
            {
                var destination = await _context.Destinations
                    .Include(d => d.Trip)
                    .FirstOrDefaultAsync(d => d.Id == destinationId);

                if (destination == null || destination.Trip == null)
                {
                    return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = "Destination not found." };
                }

                if (!await HasAccess(destination.Trip, userId, token, ShareAccessType.Edit))
                    return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = "Access denied." };

                if (createDto.StartTime >= createDto.EndTime)
                {
                    return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = "Start time must be before end time." };
                }

                if (createDto.StartTime < destination.ArrivalDate || createDto.EndTime > destination.DepartureDate)
                {
                    return new ApiResponseDTO<ActivityResponseDTO>
                    {
                        Success = false,
                        Message = $"Activity must be within destination dates ({destination.ArrivalDate.ToShortDateString()} - {destination.DepartureDate.ToShortDateString()})."
                    };
                }

                var activity = new Activity
                {
                    Id = Guid.NewGuid(),
                    DestinationId = destinationId,
                    Name = createDto.Name,
                    Description = createDto.Description,
                    Location = createDto.Location,
                    StartTime = createDto.StartTime,
                    EndTime = createDto.EndTime,
                    Cost = createDto.Cost,
                    Status = createDto.Status
                };

                _context.Activities.Add(activity);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<ActivityResponseDTO>
                {
                    Success = true,
                    Data = ActivityMapper.MapToResponseDto(activity),
                    Message = "Activity added successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<List<ActivityResponseDTO>>> GetDestinationActivitiesAsync(Guid destinationId, Guid userId,string? token, string requestingUserRole)
        {
            try
            {
                var destination = await _context.Destinations
                    .Include(d => d.Trip)
                    .FirstOrDefaultAsync(d => d.Id == destinationId);

                if (destination == null || destination.Trip == null)
                {
                    return new ApiResponseDTO<List<ActivityResponseDTO>> { Success = false, Message = "Destination not found." };
                }

                if (!await HasAccess(destination.Trip, userId, token, ShareAccessType.Edit) && !await HasAccess(destination.Trip, userId, token, ShareAccessType.View)
                   && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<List<ActivityResponseDTO>> { Success = false, Message = "Permission denied." };
                }

                var activities = await _context.Activities
                    .Where(a => a.DestinationId == destinationId)
                    .OrderBy(a => a.StartTime) 
                    .ToListAsync();

                var dtos = activities.Select(ActivityMapper.MapToResponseDto).ToList();

                return new ApiResponseDTO<List<ActivityResponseDTO>>
                {
                    Success = true,
                    Data = dtos,
                    Message = $"Retrieved {activities.Count} activities."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<ActivityResponseDTO>> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<ActivityResponseDTO>> UpdateActivityAsync(Guid activityId, string? token, ActivityCreateDTO updateDto, Guid userId, string requestingUserRole)
        {
            try
            {
                var activity = await _context.Activities
                    .Include(a => a.Destination)
                    .ThenInclude(d => d!.Trip)
                    .FirstOrDefaultAsync(a => a.Id == activityId);

                if (activity == null || activity.Destination == null || activity.Destination.Trip == null)
                {
                    return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = "Activity not found." };
                }

                if (!await HasAccess(activity.Destination.Trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = "Permission denied." };
                }

                if (updateDto.StartTime >= updateDto.EndTime)
                {
                    return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = "Start time must be before end time." };
                }

                if (updateDto.StartTime < activity.Destination.ArrivalDate || updateDto.EndTime > activity.Destination.DepartureDate)
                {
                    return new ApiResponseDTO<ActivityResponseDTO>
                    {
                        Success = false,
                        Message = $"Activity must be within destination dates ({activity.Destination.ArrivalDate.ToShortDateString()} - {activity.Destination.DepartureDate.ToShortDateString()})."
                    };
                }

                activity.Name = updateDto.Name;
                activity.Description = updateDto.Description;
                activity.Location = updateDto.Location;
                activity.StartTime = updateDto.StartTime;
                activity.EndTime = updateDto.EndTime;
                activity.Cost = updateDto.Cost;
                activity.Status = updateDto.Status;

                _context.Activities.Update(activity);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<ActivityResponseDTO>
                {
                    Success = true,
                    Data = ActivityMapper.MapToResponseDto(activity),
                    Message = "Activity updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<ActivityResponseDTO> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<bool>> DeleteActivityAsync(Guid activityId, string? token, Guid userId, string requestingUserRole)
        {
            try
            {
                var activity = await _context.Activities
                    .Include(a => a.Destination)
                    .ThenInclude(d => d!.Trip)
                    .FirstOrDefaultAsync(a => a.Id == activityId);

                if (activity == null || activity.Destination == null || activity.Destination.Trip == null)
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Activity not found." };
                }

                if (!await HasAccess(activity.Destination.Trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Permission denied." };
                }

                _context.Activities.Remove(activity);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool> { Success = true, Data = true, Message = "Activity deleted successfully." };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }
    }
}