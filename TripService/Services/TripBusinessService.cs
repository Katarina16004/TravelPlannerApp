using Common.DTOs;
using Common.DTOs.Trip;
using Common.DTOs.Trip.Destination;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Mappers;
using TripService.Models;

namespace TripService.Services
{
    public class TripBusinessService : ITripService
    {
        private readonly TripDbContext _context;

        public TripBusinessService(TripDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponseDTO<TripResponseDTO>> CreateTripAsync(Guid userId, TripCreateDTO createDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(createDto.Name))
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Trip name is required."
                    };
                }

                if (createDto.StartDate >= createDto.EndDate)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Start date must be before end date."
                    };
                }

                if (createDto.Budget < 0)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Budget cannot be negative."
                    };
                }

                var trip = new Trip
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Name = createDto.Name,
                    Description = createDto.Description ?? string.Empty,
                    StartDate = createDto.StartDate,
                    EndDate = createDto.EndDate,
                    Budget = createDto.Budget,
                    Status = "Planning",
                    CreatedAt = DateTime.UtcNow,
                    Note= createDto.Note
                };

                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();

                var tripResponseDto = TripMapper.MapToResponseDto(trip);

                return new ApiResponseDTO<TripResponseDTO>
                {
                    Success = true,
                    Data = tripResponseDto,
                    Message = "Trip created successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<TripResponseDTO>
                {
                    Success = false,
                    Message = $"Error creating trip: {ex.Message}-> Inner: {ex.InnerException?.Message}"
                };
            }
        }

        public async Task<ApiResponseDTO<TripResponseDTO>> GetTripByIdAsync(Guid tripId, Guid userId)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

                if (trip == null)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Trip not found."
                    };
                }

                if (trip.UserId != userId)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "You do not have permission to view this trip."
                    };
                }

                var tripResponseDto = TripMapper.MapToResponseDto(trip);

                return new ApiResponseDTO<TripResponseDTO>
                {
                    Success = true,
                    Data = tripResponseDto,
                    Message = "Trip retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<TripResponseDTO>
                {
                    Success = false,
                    Message = $"Error retrieving trip: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDTO<List<TripResponseDTO>>> GetUserTripsAsync(Guid userId)
        {
            try
            {
                var trips = await _context.Trips
                    .Where(t => t.UserId == userId)
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();

                var tripResponseDtos = trips.Select(TripMapper.MapToResponseDto).ToList();

                return new ApiResponseDTO<List<TripResponseDTO>>
                {
                    Success = true,
                    Data = tripResponseDtos,
                    Message = $"Retrieved {trips.Count} trips."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<TripResponseDTO>>
                {
                    Success = false,
                    Message = $"Error retrieving trips: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponseDTO<TripResponseDTO>> UpdateTripAsync(Guid tripId, TripUpdateDTO updateDto, Guid userId)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

                if (trip == null)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Trip not found."
                    };
                }

                if (trip.UserId != userId)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "You do not have permission to update this trip."
                    };
                }

                if (string.IsNullOrWhiteSpace(updateDto.Name))
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Trip name is required."
                    };
                }

                if (updateDto.StartDate >= updateDto.EndDate)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Start date must be before end date."
                    };
                }

                if (updateDto.Budget < 0)
                {
                    return new ApiResponseDTO<TripResponseDTO>
                    {
                        Success = false,
                        Message = "Budget cannot be negative."
                    };
                }

                trip.Name = updateDto.Name;
                trip.Description = updateDto.Description ?? string.Empty;
                trip.StartDate = updateDto.StartDate;
                trip.EndDate = updateDto.EndDate;
                trip.Budget = updateDto.Budget;
                trip.Note = updateDto.Note;

                _context.Trips.Update(trip);
                await _context.SaveChangesAsync();

                var tripResponseDto = TripMapper.MapToResponseDto(trip);

                return new ApiResponseDTO<TripResponseDTO>
                {
                    Success = true,
                    Data = tripResponseDto,
                    Message = "Trip updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<TripResponseDTO>
                {
                    Success = false,
                    Message = $"Error updating trip: {ex.Message}"
                };
            }
        }
        public async Task<ApiResponseDTO<bool>> DeleteTripAsync(Guid tripId, Guid userId)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

                if (trip == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Trip not found."
                    };
                }

                if (trip.UserId != userId)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "You do not have permission to delete this trip."
                    };
                }

                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool>
                {
                    Success = true,
                    Data = true,
                    Message = "Trip deleted successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Error deleting trip: {ex.Message}"
                };
            }
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