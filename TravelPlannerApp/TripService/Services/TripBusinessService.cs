using Common.DTOs;
using Common.DTOs.Trip;
using Common.DTOs.Trip.Destination;
using Common.Enums;
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
        private readonly ITripShareService _tripShareService;   

        public TripBusinessService(TripDbContext context, ITripShareService tripShareService)
        {
            _context = context;
            _tripShareService = tripShareService;
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
                    Status = TripStatus.Planning,
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

        public async Task<ApiResponseDTO<TripResponseDTO>> GetTripByIdAsync(Guid tripId, Guid userId, string? token)
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
                    var accessType = await _tripShareService.GetAccessTypeAsync(token);
                    if (accessType == null) 
                        return new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Access denied." };
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

        public async Task<ApiResponseDTO<TripResponseDTO>> UpdateTripAsync(Guid tripId, TripUpdateDTO updateDto, Guid userId, string? token, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

                if (trip == null)
                {
                    return new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Trip not found." };
                }

                if (requestingUserRole != "Admin")
                {
                    if (trip.UserId != userId)
                    {
                        var accessType = await _tripShareService.GetAccessTypeAsync(token);
                        if (accessType != ShareAccessType.Edit)
                            return new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Access denied. Edit permission required." };
                    }
                }

                if (string.IsNullOrWhiteSpace(updateDto.Name))
                {
                    return new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Trip name is required." };
                }

                if (updateDto.StartDate >= updateDto.EndDate)
                {
                    return new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Start date must be before end date." };
                }

                if (updateDto.Budget < 0)
                {
                    return new ApiResponseDTO<TripResponseDTO> { Success = false, Message = "Budget cannot be negative." };
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
                return new ApiResponseDTO<TripResponseDTO> { Success = false, Message = $"Error updating trip: {ex.Message}" };
            }
        }
        public async Task<ApiResponseDTO<bool>> DeleteTripAsync(Guid tripId, Guid userId, string requestingUserRole)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

                if (trip == null)
                {
                    return new ApiResponseDTO<bool> { Success = false, Message = "Trip not found." };
                }

                if (requestingUserRole != "Admin" && trip.UserId != userId)
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
                return new ApiResponseDTO<bool> { Success = false, Message = $"Error deleting trip: {ex.Message}" };
            }
        }
        public async Task<ApiResponseDTO<List<TripResponseDTO>>> GetAllTripsAdminAsync(Guid requestingUserId, string requestingUserRole)
        {
            try
            {
                if (requestingUserRole != "Admin")
                {
                    return new ApiResponseDTO<List<TripResponseDTO>>
                    {
                        Success = false,
                        Message = "Access denied. Only Admins can fetch all trips."
                    };
                }

                var trips = await _context.Trips.ToListAsync();
                var tripDtos = trips.Select(trip => TripMapper.MapToResponseDto(trip)).ToList();

                return new ApiResponseDTO<List<TripResponseDTO>>
                {
                    Success = true,
                    Data = tripDtos,
                    Message = "All system trips retrieved successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<TripResponseDTO>>
                {
                    Success = false,
                    Message = $"Error retrieving all trips: {ex.Message}"
                };
            }
        }
    }
}