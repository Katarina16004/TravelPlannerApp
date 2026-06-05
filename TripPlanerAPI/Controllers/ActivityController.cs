using Common.DTOs.Trip.Activity;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Security.Claims;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _activityServiceProxy;

        public ActivityController()
        {
            _activityServiceProxy = ServiceProxy.Create<IActivityService>(
                new Uri("fabric:/TravelPlannerApp/TripService"));
        }

        [HttpPost("api/destination/{destinationId}/activities")]
        [Authorize]
        public async Task<IActionResult> AddActivity(Guid destinationId, [FromBody] ActivityCreateDTO createDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                var result = await _activityServiceProxy.AddActivityAsync(destinationId, userId, createDto);

                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("api/destination/{destinationId}/activities")]
        [Authorize]
        public async Task<IActionResult> GetDestinationActivities(Guid destinationId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _activityServiceProxy.GetDestinationActivitiesAsync(destinationId, userId, role);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpPut("api/activities/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateActivity(Guid id, [FromBody] ActivityCreateDTO updateDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _activityServiceProxy.UpdateActivityAsync(id, updateDto, userId, role);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("api/activities/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _activityServiceProxy.DeleteActivityAsync(id, userId, role);
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