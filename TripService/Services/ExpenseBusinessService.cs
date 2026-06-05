using Common.DTOs;
using Common.DTOs.Trip.Expense;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Mappers;
using TripService.Models;

namespace TripService.Services
{
    public class ExpenseBusinessService : IExpenseService
    {
        private readonly TripDbContext _context;

        public ExpenseBusinessService(TripDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseDTO<ExpenseResponseDTO>> AddExpenseAsync(Guid tripId, Guid userId, ExpenseCreateDTO createDto)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<ExpenseResponseDTO> { Success = false, Message = "Trip not found." };
                }

                if (trip.UserId != userId)
                {
                    return new ApiResponseDTO<ExpenseResponseDTO> { Success = false, Message = "Permission denied." };
                }

                var expense = new Expense
                {
                    Id = Guid.NewGuid(),
                    TripId = tripId,
                    Title = createDto.Title,
                    Description = createDto.Description,
                    Amount = createDto.Amount,
                    Category = createDto.Category,
                    Currency = createDto.Currency,
                    Date = createDto.Date
                };

                _context.Expenses.Add(expense);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<ExpenseResponseDTO>
                {
                    Success = true,
                    Data = ExpenseMapper.MapToResponseDto(expense),
                    Message = "Expense added successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<ExpenseResponseDTO> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<List<ExpenseResponseDTO>>> GetTripExpensesAsync(Guid tripId, Guid userId, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<List<ExpenseResponseDTO>> { Success = false, Message = "Trip not found." };
                }

                if (trip.UserId != userId && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<List<ExpenseResponseDTO>> { Success = false, Message = "Permission denied." };
                }

                var expenses = await _context.Expenses
                    .Where(e => e.TripId == tripId)
                    .OrderByDescending(e => e.Date)
                    .ToListAsync();

                var dtos = expenses.Select(ExpenseMapper.MapToResponseDto).ToList();

                return new ApiResponseDTO<List<ExpenseResponseDTO>>
                {
                    Success = true,
                    Data = dtos,
                    Message = "Expenses retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<ExpenseResponseDTO>> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<BudgetSummaryDTO>> GetBudgetSummaryAsync(Guid tripId, Guid userId)
        {
            try
            {
                var trip = await _context.Trips
                    .Include(t => t.Expenses)
                    .FirstOrDefaultAsync(t => t.Id == tripId);

                if (trip == null)
                {
                    return new ApiResponseDTO<BudgetSummaryDTO> { Success = false, Message = "Trip not found." };
                }

                if (trip.UserId != userId)
                {
                    return new ApiResponseDTO<BudgetSummaryDTO> { Success = false, Message = "Permission denied." };
                }

                decimal totalSpent = trip.Expenses.Sum(e => e.Amount);
                decimal remaining = trip.Budget - totalSpent;
                bool isOverBudget = totalSpent > trip.Budget;

                var summary = new BudgetSummaryDTO
                {
                    Budget = trip.Budget,
                    TotalSpent = totalSpent,
                    Remaining = remaining,
                    IsOverBudget = isOverBudget
                };

                return new ApiResponseDTO<BudgetSummaryDTO>
                {
                    Success = true,
                    Data = summary,
                    Message = isOverBudget ? "Warning: You have exceeded your budget!" : "Budget status retrieved."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<BudgetSummaryDTO> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<bool>> DeleteExpenseAsync(Guid expenseId, Guid userId, string requestingUserRole)
        {
            try
            {
                var expense = await _context.Expenses
                    .Include(e => e.Trip)
                    .FirstOrDefaultAsync(e => e.Id == expenseId);

                if (expense == null || expense.Trip == null)
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Expense not found." };
                }

                if (expense.Trip.UserId != userId && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Permission denied." };
                }

                _context.Expenses.Remove(expense);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool> { Success = true, Data = true, Message = "Expense deleted successfully." };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }
    }
}
