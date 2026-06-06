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
        public async Task<IActionResult> AddChecklistItem(Guid tripId, [FromBody] ChecklistCreateDTO createDto)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _checklistServiceProxy.AddItemAsync(tripId, userId, createDto);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("api/trip/{tripId}/checklist")]
        [Authorize]
        public async Task<IActionResult> GetTripChecklist(Guid tripId)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _checklistServiceProxy.GetTripItemsAsync(tripId, userId);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("api/checklist/{itemId}/toggle")]
        [Authorize]
        public async Task<IActionResult> ToggleItem(Guid itemId)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _checklistServiceProxy.ToggleItemAsync(itemId, userId);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("api/checklist/{itemId}")]
        [Authorize]
        public async Task<IActionResult> DeleteItem(Guid itemId)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _checklistServiceProxy.DeleteItemAsync(itemId, userId);

            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
        }
    }
}