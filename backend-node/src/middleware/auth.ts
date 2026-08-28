import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized access. Token missing.' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as any;
    
    // Support claims from .NET JWT generator or Node JWT generator
    const userId = decoded.sub || decoded.userId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const email = decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

    if (!userId) {
      res.status(401).json({ message: 'Invalid token structure.' });
      return;
    }

    req.user = {
      userId: parseInt(userId, 10),
      email: email || '',
      role: role || '',
      firstName: decoded.firstName || decoded.FirstName || '',
      lastName: decoded.lastName || decoded.LastName || '',
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
    return;
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const userRole = req.user.role;
    // Standardize role names for comparison
    const normalizedUserRole = userRole.toLowerCase();
    const allowed = roles.map(r => r.toLowerCase());

    if (!allowed.includes(normalizedUserRole)) {
      res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
      return;
    }

    next();
  };
};
