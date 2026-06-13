using Common.DTOs.Trip.CheckList;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Security.Claims;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    public class ChecklistController : ControllerBase
    {
        private readonly IChecklistService _checklistServiceProxy;

        public ChecklistController()
        {
            _checklistServiceProxy = ServiceProxy.Create<IChecklistService>(
                new Uri("fabric:/TravelPlannerApp/TripService"));
        }

        [HttpPost("api/trip/{tripId}/checklist")]
        [Authorize]
        public async Task<IActionResult> AddChecklistItem(Guid tripId, [FromBody] ChecklistCreateDTO createDto, [FromQuery] string? token)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var userRole = GetUserRole();

            var result = await _checklistServiceProxy.AddItemAsync(tripId, userId, token, createDto, userRole);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("api/trip/{tripId}/checklist")]
        [AllowAnonymous] 
        public async Task<IActionResult> GetTripChecklist(Guid tripId, [FromQuery] string? token)
        {
            var userId = GetUserId();
            var userRole = GetUserRole(); 

            if (userId == Guid.Empty && string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "You must be logged in or have a valid share token." });
            }

            var result = await _checklistServiceProxy.GetTripItemsAsync(tripId, userId, token, userRole);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("api/checklist/{itemId}/toggle")]
        [Authorize]
        public async Task<IActionResult> ToggleItem(Guid itemId, [FromQuery] string? token)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var userRole = GetUserRole();

            var result = await _checklistServiceProxy.ToggleItemAsync(itemId, userId, token, userRole);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("api/checklist/{itemId}")]
        [Authorize]
        public async Task<IActionResult> DeleteItem(Guid itemId, [FromQuery] string? token)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var userRole = GetUserRole();

            var result = await _checklistServiceProxy.DeleteItemAsync(itemId, userId, token, userRole);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
        }

        private string GetUserRole()
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role) ?? User.FindFirst("role");
            return roleClaim != null ? roleClaim.Value : string.Empty;
        }
    }
}