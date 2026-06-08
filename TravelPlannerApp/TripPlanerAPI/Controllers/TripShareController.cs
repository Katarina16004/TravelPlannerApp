using Common.DTOs.Trip.TripShare;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Security.Claims;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    public class TripShareController : ControllerBase
    {
        private readonly ITripShareService _tripShareServiceProxy;

        public TripShareController()
        {
            _tripShareServiceProxy = ServiceProxy.Create<ITripShareService>(
                new Uri("fabric:/TravelPlannerApp/TripService"));
        }

        [HttpPost("api/trip-shares")]
        [Authorize]
        public async Task<IActionResult> CreateShare([FromBody] CreateTripShareDto createDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                var result = await _tripShareServiceProxy.CreateShareAsync(createDto, userId);

                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("api/trip-shares/token/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSharedTrip(string token)
        {
            try
            {
                var result = await _tripShareServiceProxy.GetSharedTripAsync(token);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("api/trip-shares/trip/{tripId}")]
        [Authorize]
        public async Task<IActionResult> GetSharesByTripId(Guid tripId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                var result = await _tripShareServiceProxy.GetSharesByTripIdAsync(tripId, userId);

                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("api/trip-shares/{id}")]
        [Authorize]
        public async Task<IActionResult> RevokeShare(Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                var result = await _tripShareServiceProxy.RevokeShareAsync(id, userId);

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