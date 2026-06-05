using Common.DTOs.Trip.Expense;
using TripService.Models;

namespace TripService.Mappers
{
    public static class ExpenseMapper
    {
        public static ExpenseResponseDTO MapToResponseDto(Expense expense)
        {
            return new ExpenseResponseDTO
            {
                Id = expense.Id,
                TripId = expense.TripId,
                Title = expense.Title,
                Description = expense.Description,
                Amount = expense.Amount,
                Category = expense.Category,
                Currency = expense.Currency,
                Date = expense.Date
            };
        }
    }
}
