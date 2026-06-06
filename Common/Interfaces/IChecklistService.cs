using Common.DTOs;
using Common.DTOs.Trip.CheckList;

namespace Common.Interfaces
{
    public interface IChecklistService
    {
        Task<ApiResponseDTO<ChecklistResponseDTO>> AddItemAsync(Guid tripId, ChecklistCreateDTO createDto, Guid userId);
        Task<ApiResponseDTO<List<ChecklistResponseDTO>>> GetTripItemsAsync(Guid tripId, Guid userId);
        Task<ApiResponseDTO<bool>> ToggleItemAsync(Guid itemId, Guid userId);
        Task<ApiResponseDTO<bool>> DeleteItemAsync(Guid itemId, Guid userId);
    }
}
