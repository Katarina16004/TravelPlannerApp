using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Common.Interfaces;
using Common.DTOs.Trip;
using Common.DTOs;
using System.Security.Claims;

namespace TripPlanerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TripController : ControllerBase
    {
        private readonly ITripService _tripServiceProxy;

        public TripController()
        {
            _tripServiceProxy = ServiceProxy.Create<ITripService>(
                new Uri("fabric:/TravelPlannerApp/TripService"));
        }

        private Guid GetUserIdFromClaims()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
        }

        // POST: api/trip
        [HttpPost]
        public async Task<IActionResult> CreateTrip([FromBody] TripCreateDTO createDto)
        {
            Guid userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized(new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Invalid token." });

            var result = await _tripServiceProxy.CreateTripAsync(userId, createDto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET: api/trip
        [HttpGet]
        public async Task<IActionResult> GetUserTrips()
        {
            Guid userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized(new ApiResponseDTO<List<TripResponseDTO>> { Success = false, Message = "Invalid token." });

            var result = await _tripServiceProxy.GetUserTripsAsync(userId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET: api/trip/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTripById(Guid id)
        {
            Guid userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized(new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Invalid token." });

            var result = await _tripServiceProxy.GetTripByIdAsync(id, userId);
            return result.Success ? Ok(result) : NotFound(result);
        }

        // PUT: api/trip/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(Guid id, [FromBody] TripUpdateDTO updateDto)
        {
            Guid userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized(new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Invalid token." });

            var result = await _tripServiceProxy.UpdateTripAsync(id, updateDto, userId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // DELETE: api/trip/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(Guid id)
        {
            Guid userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized(new ApiResponseDTO<bool> { Success = false, Message = "Invalid token." });

            var result = await _tripServiceProxy.DeleteTripAsync(id, userId);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}