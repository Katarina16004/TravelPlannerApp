using Common.DTOs;
using Common.DTOs.Trip.Expense;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IExpenseService : IService
    {
        Task<ApiResponseDTO<ExpenseResponseDTO>> AddExpenseAsync(Guid tripId, Guid userId, string? sharingToken, ExpenseCreateDTO createDto, string requestingUserRole);
        Task<ApiResponseDTO<List<ExpenseResponseDTO>>> GetTripExpensesAsync(Guid tripId, Guid userId, string? sharingToken, string requestingUserRole);
        Task<ApiResponseDTO<BudgetSummaryDTO>> GetBudgetSummaryAsync(Guid tripId, Guid userId, string? sharingToken, string requestingUserRole);
        Task<ApiResponseDTO<bool>> DeleteExpenseAsync(Guid expenseId, Guid userId, string? sharingToken, string requestingUserRole);
    }
}
