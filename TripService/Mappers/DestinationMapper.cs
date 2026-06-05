using Common.DTOs.Trip.Destination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripService.Models;

namespace TripService.Mappers
{
    public static class DestinationMapper
    {
        public static DestinationResponseDTO MapToResponseDto(Destination destination)
        {
            if (destination == null) return null!;

            return new DestinationResponseDTO
            {
                Id = destination.Id,
                TripId = destination.TripId,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description
            };
        }
    }
}
