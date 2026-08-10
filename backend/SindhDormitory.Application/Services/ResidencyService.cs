using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.DTOs.Residency;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Application.Services;

public class ResidencyService : IResidencyService
{
    private readonly IApplicationDbContext _context;

    public ResidencyService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentResidencyDto> GetStudentResidencyAsync(int userId)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            throw new KeyNotFoundException("Student record not found.");

        var activeAllocation = await _context.Allocations
            .Include(a => a.Bed)
                .ThenInclude(b => b.Room)
                    .ThenInclude(r => r.Floor)
                        .ThenInclude(f => f.Block)
                            .ThenInclude(bl => bl.Hostel)
            .Include(a => a.Resident)
            .FirstOrDefaultAsync(a => a.StudentId == student.StudentId && a.IsActive);

        if (activeAllocation == null || activeAllocation.Resident == null)
        {
            return new StudentResidencyDto
            {
                IsExistingResident = false,
                ResidencyStatus = "Inactive",
                AllowFreshApplication = true
            };
        }

        var resident = activeAllocation.Resident;
        var bed = activeAllocation.Bed;
        var room = bed.Room;
        var block = room.Floor.Block;
        var hostel = block.Hostel;

        // Check annual fee status via active application / processing fee
        var fee = await _context.ProcessingFees
            .Include(f => f.Challans)
            .FirstOrDefaultAsync(f => f.ApplicationId == activeAllocation.ApplicationId);

        var challan = fee?.Challans.FirstOrDefault();

        return new StudentResidencyDto
        {
            IsExistingResident = true,
            ResidentId = resident.ResidentId,
            ResidencyStatus = resident.IsCurrentResident ? "Active" : "Inactive",
            HostelName = hostel.Name,
            BlockName = block.BlockName,
            RoomNumber = room.RoomNumber,
            BedLabel = bed.BedLabel,
            CheckInDate = resident.CheckInDate,
            AnnualFeeStatus = fee != null ? fee.Status.ToString() : "Unpaid",
            AnnualChallan = fee != null ? new ProcessingFeeChallanDto
            {
                FeeId = fee.FeeId,
                ChallanNumber = challan?.ChallanNumber ?? $"ANN-2026-{resident.ResidentId:D4}",
                Amount = 15000.00m, // Annual Resident Fee
                Status = fee.Status.ToString(),
                CreatedAt = fee.CreatedAt,
                DueDate = fee.DueDate.ToDateTime(TimeOnly.MinValue)
            } : null,
            CanRequestRoomChange = true,
            AllowFreshApplication = false
        };
    }

    public async Task<ProcessingFeeChallanDto> GenerateAnnualFeeChallanAsync(int userId)
    {
        var residency = await GetStudentResidencyAsync(userId);
        if (!residency.IsExistingResident || !residency.ResidentId.HasValue)
            throw new InvalidOperationException("Only existing residents can generate annual fee challans.");

        var resident = await _context.Residents
            .Include(r => r.Allocation)
            .FirstAsync(r => r.ResidentId == residency.ResidentId.Value);

        var fee = await _context.ProcessingFees
            .Include(f => f.Challans)
            .FirstOrDefaultAsync(f => f.ApplicationId == resident.Allocation.ApplicationId);

        if (fee == null)
        {
            fee = new ProcessingFee
            {
                ApplicationId = resident.Allocation.ApplicationId,
                Amount = 15000.00m,
                Status = FeeStatus.Pending,
                DueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(15)),
                Challans = new List<Challan>
                {
                    new Challan
                    {
                        ChallanNumber = $"ANN-2026-{resident.ResidentId:D4}",
                        ExpiresAt = DateTime.UtcNow.AddDays(15)
                    }
                }
            };

            _context.ProcessingFees.Add(fee);
            await _context.SaveChangesAsync();
        }

        var challan = fee.Challans.First();
        return new ProcessingFeeChallanDto
        {
            FeeId = fee.FeeId,
            ChallanNumber = challan.ChallanNumber,
            Amount = fee.Amount,
            Status = fee.Status.ToString(),
            CreatedAt = fee.CreatedAt,
            DueDate = fee.DueDate.ToDateTime(TimeOnly.MinValue)
        };
    }

    public async Task<StudentResidencyDto> VerifyAnnualFeePaymentAsync(int userId, VerifyPaymentRequest request)
    {
        var residency = await GetStudentResidencyAsync(userId);
        if (!residency.IsExistingResident)
            throw new InvalidOperationException("Not an existing resident.");

        var fee = await _context.ProcessingFees.FirstOrDefaultAsync(f => f.FeeId == request.FeeId);
        if (fee == null) throw new KeyNotFoundException("Challan record not found.");

        fee.Status = FeeStatus.Paid;
        await _context.SaveChangesAsync();

        return await GetStudentResidencyAsync(userId);
    }

    public async Task<RoomChangeRequestDto> CreateRoomChangeRequestAsync(int userId, CreateRoomChangeRequestDto dto)
    {
        var residency = await GetStudentResidencyAsync(userId);
        if (!residency.IsExistingResident || !residency.ResidentId.HasValue)
        {
            throw new UnauthorizedAccessException("Only active existing residents can request a room change.");
        }

        var req = new RoomChangeRequest
        {
            ResidentId = residency.ResidentId.Value,
            Reason = dto.Reason,
            PreferredBlock = dto.PreferredBlock,
            AdditionalDetails = dto.AdditionalDetails,
            AttachmentUrl = dto.AttachmentUrl,
            Status = RequestStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.RoomChangeRequests.Add(req);
        await _context.SaveChangesAsync();

        return new RoomChangeRequestDto
        {
            RequestId = req.RequestId,
            ResidentId = req.ResidentId,
            CurrentHostelRoom = $"{residency.HostelName} - Block {residency.BlockName}, Room {residency.RoomNumber}",
            PreferredBlock = req.PreferredBlock,
            Reason = req.Reason,
            AdditionalDetails = req.AdditionalDetails,
            AttachmentUrl = req.AttachmentUrl,
            Status = "Submitted",
            AdminRemarks = req.AdminRemarks,
            CreatedAt = req.CreatedAt
        };
    }

    public async Task<List<RoomChangeRequestDto>> GetStudentRoomChangeRequestsAsync(int userId)
    {
        var residency = await GetStudentResidencyAsync(userId);
        if (!residency.IsExistingResident || !residency.ResidentId.HasValue)
            return new List<RoomChangeRequestDto>();

        var requests = await _context.RoomChangeRequests
            .Where(r => r.ResidentId == residency.ResidentId.Value)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return requests.Select(r => new RoomChangeRequestDto
        {
            RequestId = r.RequestId,
            ResidentId = r.ResidentId,
            CurrentHostelRoom = $"{residency.HostelName} - Block {residency.BlockName}, Room {residency.RoomNumber}",
            PreferredBlock = r.PreferredBlock,
            Reason = r.Reason,
            AdditionalDetails = r.AdditionalDetails,
            AttachmentUrl = r.AttachmentUrl,
            Status = MapRequestStatus(r.Status),
            AdminRemarks = r.AdminRemarks,
            CreatedAt = r.CreatedAt
        }).ToList();
    }

    public async Task<RoomChangeRequestDto> GetRoomChangeRequestByIdAsync(int userId, int requestId)
    {
        var requests = await GetStudentRoomChangeRequestsAsync(userId);
        var item = requests.FirstOrDefault(r => r.RequestId == requestId);
        if (item == null)
            throw new KeyNotFoundException("Room change request not found or ownership mismatch.");

        return item;
    }

    private string MapRequestStatus(RequestStatus status)
    {
        return status switch
        {
            RequestStatus.Pending     => "Submitted",
            RequestStatus.UnderReview => "Under Review",
            RequestStatus.Approved    => "Approved",
            RequestStatus.Rejected    => "Rejected",
            RequestStatus.Cancelled   => "Cancelled",
            _                         => "In Progress"
        };
    }
}
