using Common.DTOs;
using Common.DTOs.Trip.Destination;
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

        public DestinationBusinessService(TripDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseDTO<DestinationResponseDTO>> AddDestinationAsync(Guid tripId, Guid userId, DestinationCreateDTO createDto)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "Trip not found." };
                }

                if (trip.UserId != userId)
                {
                    return new ApiResponseDTO<DestinationResponseDTO> { Success = false, Message = "You do not have permission to add destinations to this trip." };
                }

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

        public async Task<ApiResponseDTO<List<DestinationResponseDTO>>> GetTripDestinationsAsync(Guid tripId, Guid userId, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null)
                {
                    return new ApiResponseDTO<List<DestinationResponseDTO>> { Success = false, Message = "Trip not found." };
                }

                if (trip.UserId != userId && requestingUserRole != "Admin")
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

        public async Task<ApiResponseDTO<DestinationResponseDTO>> UpdateDestinationAsync(Guid destinationId, DestinationCreateDTO updateDto, Guid userId, string requestingUserRole)
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

                if (destination.Trip.UserId != userId && requestingUserRole != "Admin")
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

        public async Task<ApiResponseDTO<bool>> DeleteDestinationAsync(Guid destinationId, Guid userId, string requestingUserRole)
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

                if (destination.Trip.UserId != userId && requestingUserRole != "Admin")
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
    }
}