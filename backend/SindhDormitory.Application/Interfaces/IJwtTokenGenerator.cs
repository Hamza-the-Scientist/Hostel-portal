using SindhDormitory.Domain.Entities;

namespace SindhDormitory.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
