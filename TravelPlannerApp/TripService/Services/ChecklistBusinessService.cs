using Common.DTOs;
using Common.DTOs.Trip.CheckList;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;

namespace TripService.Services
{
    public class ChecklistBusinessService : IChecklistService
    {
        private readonly TripDbContext _context;

        public ChecklistBusinessService(TripDbContext context) => _context = context;

        public async Task<ApiResponseDTO<ChecklistResponseDTO>> AddItemAsync(Guid tripId, Guid userId, ChecklistCreateDTO createDto)
        {
            var item = new ChecklistItem { Id = Guid.NewGuid(), TripId = tripId, Title = createDto.Title, IsCompleted = false };
            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();
            return new ApiResponseDTO<ChecklistResponseDTO> { Success = true, Data = new ChecklistResponseDTO { Id = item.Id, Title = item.Title, IsCompleted = item.IsCompleted } };
        }

        public async Task<ApiResponseDTO<List<ChecklistResponseDTO>>> GetTripItemsAsync(Guid tripId, Guid userId)
        {
            var items = await _context.ChecklistItems
                .Where(x => x.TripId == tripId)
                .Select(x => new ChecklistResponseDTO { Id = x.Id, Title = x.Title, IsCompleted = x.IsCompleted })
                .ToListAsync();
            return new ApiResponseDTO<List<ChecklistResponseDTO>> { Success = true, Data = items };
        }

        public async Task<ApiResponseDTO<bool>> ToggleItemAsync(Guid itemId, Guid userId)
        {
            var item = await _context.ChecklistItems.FindAsync(itemId);
            if (item == null) return new ApiResponseDTO<bool> { Success = false, Message = "Item not found" };

            item.IsCompleted = !item.IsCompleted;
            await _context.SaveChangesAsync();
            return new ApiResponseDTO<bool> { Success = true, Data = true };
        }

        public async Task<ApiResponseDTO<bool>> DeleteItemAsync(Guid itemId, Guid userId)
        {
            var item = await _context.ChecklistItems.FindAsync(itemId);
            if (item == null) return new ApiResponseDTO<bool> { Success = false, Message = "Item not found" };

            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();
            return new ApiResponseDTO<bool> { Success = true, Data = true };
        }
    }
}