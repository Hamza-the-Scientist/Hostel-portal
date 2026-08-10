using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Application.DTOs.Auth;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    
    // Additional claims can be added here if necessary
    // public int? StudentId { get; set; }
    // public int? AdminId { get; set; }
}
