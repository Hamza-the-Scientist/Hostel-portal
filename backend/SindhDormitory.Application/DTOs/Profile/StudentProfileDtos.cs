namespace SindhDormitory.Application.DTOs.Profile;

public class VerifiedUniversityInfoDto
{
    public string FullName { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string Cnic { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public int Semester { get; set; }
    public decimal Cgpa { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
}

public class PersonalInfoDto
{
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
    public string? GuardianRelation { get; set; }
    public string? HomeAddress { get; set; }
    public string? City { get; set; }
    public string? EmergencyContact { get; set; }
    public string? BloodGroup { get; set; }
    public string? Disabilities { get; set; }
}

public class StudentProfileDto
{
    public int StudentId { get; set; }
    public VerifiedUniversityInfoDto VerifiedInfo { get; set; } = new();
    public PersonalInfoDto PersonalInfo { get; set; } = new();
}

public class UpdateStudentProfileRequest
{
    public string? PhoneNumber { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
    public string? GuardianRelation { get; set; }
    public string? HomeAddress { get; set; }
    public string? City { get; set; }
    public string? EmergencyContact { get; set; }
    public string? BloodGroup { get; set; }
    public string? Disabilities { get; set; }
}
