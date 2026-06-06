using Common.DTOs;
using Common.DTOs.Trip.TripShare;
using Common.Enums;
using Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using TripService.Data;
using TripService.Mappers;
using TripService.Models;

namespace TripService.Services
{
    public class TripShareBusinessService : ITripShareService
    {
        private readonly TripDbContext _context;

        public TripShareBusinessService(TripDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseDTO<TripShareDto>> CreateShareAsync(CreateTripShareDto dto, Guid userId)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == dto.TripId);
                if (trip == null) return new ApiResponseDTO<TripShareDto> { Success = false, Message = "Trip not found." };
                if (trip.UserId != userId) return new ApiResponseDTO<TripShareDto> { Success = false, Message = "Permission denied." };

                var token = Guid.NewGuid().ToString("N");

                // Generisanje QR koda
                var qrGenerator = new QRCodeGenerator();
                var qrCodeData = qrGenerator.CreateQrCode($"https://tvoj-sajt.com/share/{token}", QRCodeGenerator.ECCLevel.Q);
                var qrCode = new PngByteQRCode(qrCodeData);
                var qrCodeImage = qrCode.GetGraphic(20);
                var base64Qr = Convert.ToBase64String(qrCodeImage);

                var share = new TripShare
                {
                    Id = Guid.NewGuid(),
                    TripId = dto.TripId,
                    Token = token,
                    AccessType = dto.AccessType,
                    ExpiresAt = DateTime.UtcNow.AddDays(dto.ExpiresInDays),
                    QrCodeBase64 = base64Qr
                };

                _context.TripShares.Add(share);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<TripShareDto>
                {
                    Success = true,
                    Data = new TripShareDto
                    {
                        Id = share.Id,
                        TripId = share.TripId,
                        Token = share.Token,
                        AccessType = share.AccessType,
                        ExpiresAt = share.ExpiresAt,
                        QrCodeBase64 = share.QrCodeBase64
                    },
                    Message = "Share link created successfully."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<TripShareDto> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<SharedTripDto>> GetSharedTripAsync(string token)
        {
            try
            {
                var share = await _context.TripShares
                    .Include(s => s.Trip)
                    .FirstOrDefaultAsync(s => s.Token == token);

                if (share == null || share.ExpiresAt < DateTime.UtcNow)
                    return new ApiResponseDTO<SharedTripDto> { Success = false, Message = "Invalid or expired link." };

                return new ApiResponseDTO<SharedTripDto>
                {
                    Success = true,
                    Data = new SharedTripDto
                    {
                        AccessType = share.AccessType,
                        Trip = TripMapper.MapToResponseDto(share.Trip)
                    }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<SharedTripDto> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<IEnumerable<TripShareDto>>> GetSharesByTripIdAsync(Guid tripId, Guid userId)
        {
            try
            {
                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
                if (trip == null || trip.UserId != userId)
                    return new ApiResponseDTO<IEnumerable<TripShareDto>> { Success = false, Message = "Permission denied." };

                var shares = await _context.TripShares
                    .Where(s => s.TripId == tripId)
                    .ToListAsync();

                var dtos = shares.Select(s => new TripShareDto
                {
                    Id = s.Id,
                    TripId = s.TripId,
                    Token = s.Token,
                    AccessType = s.AccessType,
                    ExpiresAt = s.ExpiresAt,
                    QrCodeBase64 = s.QrCodeBase64
                }).ToList();

                return new ApiResponseDTO<IEnumerable<TripShareDto>> { Success = true, Data = dtos };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<IEnumerable<TripShareDto>> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ApiResponseDTO<bool>> RevokeShareAsync(Guid id, Guid userId)
        {
            try
            {
                var share = await _context.TripShares
                    .Include(s => s.Trip)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (share == null || share.Trip.UserId != userId)
                    return new ApiResponseDTO<bool> { Success = false, Message = "Permission denied or not found." };

                _context.TripShares.Remove(share);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool> { Success = true, Data = true, Message = "Share revoked successfully." };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool> { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<ShareAccessType?> GetAccessTypeAsync(string token)
        {
            if (string.IsNullOrEmpty(token)) return null;

            var share = await _context.TripShares
                .FirstOrDefaultAsync(s => s.Token == token && s.ExpiresAt > DateTime.UtcNow);

            return share?.AccessType;
        }
    }
}