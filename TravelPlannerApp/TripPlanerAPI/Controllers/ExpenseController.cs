using Common.DTOs.Trip.Expense;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Security.Claims;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseServiceProxy;

        public ExpenseController()
        {
            _expenseServiceProxy = ServiceProxy.Create<IExpenseService>(
                new Uri("fabric:/TravelPlannerApp/TripService"));
        }

        [HttpPost("api/trip/{tripId}/expenses")]
        [Authorize]
        public async Task<IActionResult> AddExpense(Guid tripId, [FromBody] ExpenseCreateDTO createDto, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);

                string role = roleClaim.Value;
                var result = await _expenseServiceProxy.AddExpenseAsync(tripId, userId, token, createDto, role);

                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("api/trip/{tripId}/expenses")]
        [Authorize]
        public async Task<IActionResult> GetTripExpenses(Guid tripId, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _expenseServiceProxy.GetTripExpensesAsync(tripId, userId, token, role);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("api/trip/{tripId}/budget-summary")]
        [Authorize]
        public async Task<IActionResult> GetBudgetSummary(Guid tripId, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);

                string role = roleClaim.Value;
                var result = await _expenseServiceProxy.GetBudgetSummaryAsync(tripId, userId, token, role);

                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("api/expenses/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteExpense(Guid id, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _expenseServiceProxy.DeleteExpenseAsync(id, userId, token, role);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }
    }
}