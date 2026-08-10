using System.ComponentModel.DataAnnotations;

namespace SindhDormitory.Application.DTOs.Auth;

public class StudentLoginRequest
{
    [Required(ErrorMessage = "CNIC is required.")]
    [StringLength(13, MinimumLength = 13, ErrorMessage = "CNIC must be exactly 13 digits.")]
    [RegularExpression("^[0-9]*$", ErrorMessage = "CNIC must contain only numbers.")]
    public string Cnic { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}
