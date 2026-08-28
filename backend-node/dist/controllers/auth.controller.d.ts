import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    static studentLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    static adminLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    static registerStudent(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map