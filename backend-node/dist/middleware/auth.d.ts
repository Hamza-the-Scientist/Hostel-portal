import { Request, Response, NextFunction } from 'express';
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
export declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireRole: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map