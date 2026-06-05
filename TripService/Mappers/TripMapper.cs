using Common.DTOs.Trip;
using TripService.Models;

namespace TripService.Mappers
{
    public static class TripMapper
    {
        public static TripResponseDTO MapToResponseDto(Trip trip)
        {
            return new TripResponseDTO
            {
                Id = trip.Id,
                UserId = trip.UserId,
                Name = trip.Name,
                Description = trip.Description,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget,
                Status = trip.Status,
                CreatedAt = trip.CreatedAt,
                Note = trip.Note
            };
        }
    }
}