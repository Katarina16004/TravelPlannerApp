using Common.DTOs;
using Common.DTOs.Trip.CheckList;
using Common.Enums; 
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;

namespace TripService.Services
{
    public class ChecklistBusinessService : IChecklistService
    {
        private readonly TripDbContext _context;
        private readonly ITripShareService _tripShareService;

        public ChecklistBusinessService(TripDbContext context, ITripShareService tripShareService)
        {
            _context = context;
            _tripShareService = tripShareService;
        }

        public async Task<ApiResponseDTO<ChecklistResponseDTO>> AddItemAsync(Guid tripId, Guid userId, string? token, ChecklistCreateDTO createDto, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<ChecklistResponseDTO> { Success = false, Message = "Trip not found." };
                }

                if (!await HasAccess(trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<ChecklistResponseDTO> { Success = false, Message = "Access denied." };
                }

                var item = new ChecklistItem
                {
                    Id = Guid.NewGuid(),
                    TripId = tripId,
                    Title = createDto.Title,
                    IsCompleted = false
                };

                _context.ChecklistItems.Add(item);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<ChecklistResponseDTO>
                {
                    Success = true,
                    Data = new ChecklistResponseDTO { Id = item.Id, Title = item.Title, IsCompleted = item.IsCompleted },
                    Message = "Item added successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<ChecklistResponseDTO> { Success = false, Message = $"Error adding checklist item: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<List<ChecklistResponseDTO>>> GetTripItemsAsync(Guid tripId, Guid userId, string? token, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<List<ChecklistResponseDTO>> { Success = false, Message = "Trip not found." };
                }

                if (!await HasAccess(trip, userId, token, ShareAccessType.Edit) &&
                    !await HasAccess(trip, userId, token, ShareAccessType.View) &&
                    requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<List<ChecklistResponseDTO>> { Success = false, Message = "Permission denied." };
                }

                var items = await _context.ChecklistItems
                    .Where(x => x.TripId == tripId)
                    .Select(x => new ChecklistResponseDTO { Id = x.Id, Title = x.Title, IsCompleted = x.IsCompleted })
                    .ToListAsync();

                return new ApiResponseDTO<List<ChecklistResponseDTO>> { Success = true, Data = items, Message = $"Retrieved {items.Count} items." };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<ChecklistResponseDTO>> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<bool>> ToggleItemAsync(Guid itemId, Guid userId, string? token, string requestingUserRole)
        {
            try
            {
                var item = await _context.ChecklistItems
                    .Include(x => x.Trip)
                    .FirstOrDefaultAsync(x => x.Id == itemId);

                if (item == null || item.Trip == null)
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Item or associated trip not found." };
                }

                if (!await HasAccess(item.Trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Permission denied." };
                }

                item.IsCompleted = !item.IsCompleted;
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool> { Success = true, Data = true, Message = "Item state toggled successfully." };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<bool>> DeleteItemAsync(Guid itemId, Guid userId, string? token, string requestingUserRole)
        {
            try
            {
                var item = await _context.ChecklistItems
                    .Include(x => x.Trip)
                    .FirstOrDefaultAsync(x => x.Id == itemId);

                if (item == null || item.Trip == null)
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Item not found." };
                }

                if (!await HasAccess(item.Trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Permission denied." };
                }

                _context.ChecklistItems.Remove(item);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool> { Success = true, Data = true, Message = "Item deleted successfully." };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        private async Task<bool> HasAccess(Trip trip, Guid userId, string? token, ShareAccessType requiredAccess)
        {
            if (trip.UserId == userId) return true;

            if (string.IsNullOrEmpty(token)) return false;

            var accessType = await _tripShareService.GetAccessTypeAsync(token);

            if (accessType == ShareAccessType.Edit) return true;
            if (requiredAccess == ShareAccessType.View && accessType == ShareAccessType.View) return true;

            return false;
        }
    }
}