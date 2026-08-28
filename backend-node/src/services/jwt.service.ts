import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { User } from '../entities/User';

export const generateJwtToken = (user: User): string => {
  const payload = {
    sub: user.userId.toString(),
    userId: user.userId,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return jwt.sign(payload, jwtConfig.secret, {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    expiresIn: `${jwtConfig.expiryMinutes}m`,
  });
};
