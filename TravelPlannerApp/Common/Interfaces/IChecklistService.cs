using Common.DTOs;
using Common.DTOs.Trip.CheckList;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IChecklistService:IService
    {
        Task<ApiResponseDTO<ChecklistResponseDTO>> AddItemAsync(Guid tripId, Guid userId, string? token, ChecklistCreateDTO createDto, string requestingUserRole);
        Task<ApiResponseDTO<List<ChecklistResponseDTO>>> GetTripItemsAsync(Guid tripId, Guid userId, string? token, string requestingUserRole);
        Task<ApiResponseDTO<bool>> ToggleItemAsync(Guid itemId, Guid userId, string? token, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteItemAsync(Guid itemId, Guid userId, string? token, string requestingUserRole);
    }
}
