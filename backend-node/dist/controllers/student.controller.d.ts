import { Request, Response, NextFunction } from 'express';
export declare class StudentController {
    static getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDistrictEligibility(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
    static submitApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=student.controller.d.ts.map