using Common.DTOs;
using Common.DTOs.Trip.Destination;
using Common.Enums;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Mappers;
using TripService.Models;

namespace TripService.Services
{
    public class DestinationBusinessService : IDestinationService
    {
        private readonly TripDbContext _context;
        private readonly ITripShareService _tripShareService;

        public DestinationBusinessService(TripDbContext context, ITripShareService tripShareService)
        {
            _context = context;
            _tripShareService = tripShareService;
        }

        public async Task<ApiResponseDTO<DestinationResponseDTO>> AddDestinationAsync(Guid tripId, Guid userId, string? token, DestinationCreateDTO createDto, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "Trip not found." };
                }

                if (!await HasAccess(trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "Access denied." };

                if (createDto.ArrivalDate >= createDto.DepartureDate)
                {
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "Arrival date must be before departure date." };
                }

                if (createDto.ArrivalDate < trip.StartDate || createDto.DepartureDate > trip.EndDate)
                {
                    return new ApiResponseDTO<DestinationResponseDTO>
                    {
                        Success = false,
                        Message = $"Destination dates must be within the trip period ({trip.StartDate.ToShortDateString()} - {trip.EndDate.ToShortDateString()})."
                    };
                }

                var destination = new Destination
                {
                    Id = Guid.NewGuid(),
                    TripId = tripId,
                    Name = createDto.Name,
                    Location = createDto.Location,
                    ArrivalDate = createDto.ArrivalDate,
                    DepartureDate = createDto.DepartureDate,
                    Description = createDto.Description
                };

                _context.Destinations.Add(destination);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<DestinationResponseDTO>
                {
                    Success = true,
                    Data = DestinationMapper.MapToResponseDto(destination),
                    Message = "Destination added successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = $"Error adding destination: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<List<DestinationResponseDTO>>> GetTripDestinationsAsync(Guid tripId, Guid userId,string? token, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<List<DestinationResponseDTO>> { Success = false, Message = "Trip not found." };
                }

                if (!await HasAccess(trip, userId, token, ShareAccessType.Edit) && !await HasAccess(trip, userId, token, ShareAccessType.View) 
                    && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<List<DestinationResponseDTO>> { Success = false, Message = "Permission denied." };
                }

                var destinations = await _context.Destinations
                    .Where(d => d.TripId == tripId)
                    .OrderBy(d => d.ArrivalDate)
                    .ToListAsync();

                var dtos = destinations.Select(DestinationMapper.MapToResponseDto).ToList();

                return new ApiResponseDTO<List<DestinationResponseDTO>>
                {
                    Success = true,
                    Data = dtos,
                    Message = $"Retrieved {destinations.Count} destinations."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<DestinationResponseDTO>> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<DestinationResponseDTO>> UpdateDestinationAsync(Guid destinationId, DestinationCreateDTO updateDto, string? token, Guid userId, string requestingUserRole)
        {
            try
            {
                var destination = await _context.Destinations
                    .Include(d => d.Trip)
                    .FirstOrDefaultAsync(d => d.Id == destinationId);

                if (destination == null || destination.Trip == null)
                {
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "Destination not found." };
                }

                if (!await HasAccess(destination.Trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "Permission denied." };
                }

                if (updateDto.ArrivalDate >= updateDto.DepartureDate)
                {
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "Arrival date must be before departure date." };
                }

                if (updateDto.ArrivalDate < destination.Trip.StartDate || updateDto.DepartureDate > destination.Trip.EndDate)
                {
                    return new ApiResponseDTO<DestinationResponseDTO>
                    {
                        Success = false,
                        Message = $"Destination dates must be within the trip period ({destination.Trip.StartDate.ToShortDateString()} - {destination.Trip.EndDate.ToShortDateString()})."
                    };
                }

                destination.Name = updateDto.Name;
                destination.Location = updateDto.Location;
                destination.ArrivalDate = updateDto.ArrivalDate;
                destination.DepartureDate = updateDto.DepartureDate;
                destination.Description = updateDto.Description;

                _context.Destinations.Update(destination);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<DestinationResponseDTO>
                {
                    Success = true,
                    Data = DestinationMapper.MapToResponseDto(destination),
                    Message = "Destination updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId, string? token, string requestingUserRole)
        {
            try
            {
                var destination = await _context.Destinations
                    .Include(d => d.Trip)
                    .FirstOrDefaultAsync(d => d.Id == destinationId);

                if (destination == null || destination.Trip == null)
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Destination not found." };
                }

                if (!await HasAccess(destination.Trip, userId, token, ShareAccessType.Edit) && requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Permission denied." };
                }

                _context.Destinations.Remove(destination);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool> { Success = true, Data = true, Message = "Destination deleted successfully." };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }
        private async Task<bool> HasAccess(Trip trip, Guid userId, string? token, ShareAccessType requiredAccess)
        {
            if (trip.UserId == userId) return true;

            if (string.IsNullOrEmpty(token)) return false;

            var accessType = await _tripShareService.GetAccessTypeAsync(token);

            if (accessType == ShareAccessType.Edit) return true;
            if (requiredAccess == ShareAccessType.View && accessType == ShareAccessType.View) return true;

            return false;
        }
    }
}