using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Application.DTOs.Application;

public class EligibleHostelDto
{
    public int HostelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int AvailableBeds { get; set; }
    public double Rating { get; set; }
    public List<string> KeyAmenities { get; set; } = [];
    public bool IsEligible { get; set; }
    public string EligibilityReason { get; set; } = string.Empty;
}

public class HostelPreferenceRequest
{
    public int HostelId { get; set; }
    public int PriorityOrder { get; set; }
}

public class UpdatePreferencesRequest
{
    public int ApplicationId { get; set; }
    public List<HostelPreferenceRequest> Preferences { get; set; } = [];
}

public class ProcessingFeeChallanDto
{
    public int FeeId { get; set; }
    public string ChallanNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; } = 100.00m;
    public string Status { get; set; } = "Unpaid";
    public DateTime CreatedAt { get; set; }
    public DateTime DueDate { get; set; }
}

public class VerifyPaymentRequest
{
    public int FeeId { get; set; }
    public string TransactionReference { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "Online Banking";
}

public class ApplicationTimelineStepDto
{
    public string StepName { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public bool IsCurrent { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime? Date { get; set; }
}

public class ApplicationDto
{
    public int ApplicationId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string DisplayStatus { get; set; } = string.Empty;
    public DateTime? SubmittedAt { get; set; }
    public ProcessingFeeChallanDto? ProcessingFee { get; set; }
    public List<EligibleHostelDto> Preferences { get; set; } = [];
    public List<ApplicationTimelineStepDto> Timeline { get; set; } = [];
}
