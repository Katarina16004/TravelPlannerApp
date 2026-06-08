using Common.DTOs.Trip.Destination;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Security.Claims;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    public class DestinationController : ControllerBase
    {
        private readonly IDestinationService _destinationServiceProxy;

        public DestinationController()
        {
            _destinationServiceProxy = ServiceProxy.Create<IDestinationService>(
                    new Uri("fabric:/TravelPlannerApp/TripService"));
        }

        [HttpPost("api/trip/{tripId}/destinations")]
        [Authorize]
        public async Task<IActionResult> AddDestination(Guid tripId, [FromBody] DestinationCreateDTO createDto, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                var result = await _destinationServiceProxy.AddDestinationAsync(tripId, userId, token, createDto);

                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("api/trip/{tripId}/destinations")]
        [Authorize]
        public async Task<IActionResult> GetTripDestinations(Guid tripId, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _destinationServiceProxy.GetTripDestinationsAsync(tripId, userId, token, role);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpPut("api/destinations/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateDestination(Guid id, [FromBody] DestinationCreateDTO updateDto, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _destinationServiceProxy.UpdateDestinationAsync(id, updateDto, token, userId, role);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("api/destinations/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteDestination(Guid id, [FromQuery] string? token = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                if (userIdClaim == null || roleClaim == null) return Unauthorized();

                Guid userId = Guid.Parse(userIdClaim.Value);
                string role = roleClaim.Value;

                var result = await _destinationServiceProxy.DeleteDestinationAsync(id, userId, token, role);
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