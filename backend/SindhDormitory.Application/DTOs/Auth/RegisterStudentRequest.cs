using System.ComponentModel.DataAnnotations;
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Application.DTOs.Auth;

public class RegisterStudentRequest
{
    [Required(ErrorMessage = "Registration Number is required.")]
    [StringLength(50)]
    public string RegistrationNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "CNIC is required.")]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "CNIC must be exactly 13 digits.")]
    [RegularExpression("^[0-9]*$", ErrorMessage = "CNIC must contain only numbers.")]
    public string Cnic { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "First Name is required.")]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last Name is required.")]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone Number is required.")]
    [StringLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public Gender Gender { get; set; }

    [Required]
    public DateOnly DateOfBirth { get; set; }
}
