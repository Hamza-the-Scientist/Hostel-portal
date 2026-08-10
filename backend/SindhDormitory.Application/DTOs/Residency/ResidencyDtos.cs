using SindhDormitory.Application.DTOs.Application;
using System.ComponentModel.DataAnnotations;

namespace SindhDormitory.Application.DTOs.Residency;

public class StudentResidencyDto
{
    public bool IsExistingResident { get; set; }
    public int? ResidentId { get; set; }
    public string ResidencyStatus { get; set; } = "Inactive"; // Active / Inactive / Suspended
    public string HostelName { get; set; } = string.Empty;
    public string BlockName { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
    public string BedLabel { get; set; } = string.Empty;
    public DateOnly? CheckInDate { get; set; }
    public string AnnualFeeStatus { get; set; } = "Unpaid"; // Paid / Unpaid / Pending
    public ProcessingFeeChallanDto? AnnualChallan { get; set; }
    public bool CanRequestRoomChange { get; set; } = true;
    public bool AllowFreshApplication { get; set; } = false;
}

public class CreateRoomChangeRequestDto
{
    [Required]
    [MinLength(10, ErrorMessage = "Reason must be at least 10 characters.")]
    [MaxLength(500, ErrorMessage = "Reason cannot exceed 500 characters.")]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? PreferredBlock { get; set; }

    [MaxLength(1000)]
    public string? AdditionalDetails { get; set; }

    public string? AttachmentUrl { get; set; }
}

public class RoomChangeRequestDto
{
    public int RequestId { get; set; }
    public int ResidentId { get; set; }
    public string CurrentHostelRoom { get; set; } = string.Empty;
    public string? PreferredBlock { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? AdditionalDetails { get; set; }
    public string? AttachmentUrl { get; set; }
    public string Status { get; set; } = string.Empty; // Submitted / Under Review / In Progress / Approved / Rejected
    public string? AdminRemarks { get; set; }
    public DateTime CreatedAt { get; set; }
}
