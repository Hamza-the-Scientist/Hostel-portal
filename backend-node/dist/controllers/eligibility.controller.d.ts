import { Request, Response, NextFunction } from 'express';
export declare class EligibilityController {
    static getDistricts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDistrictsManagement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateDistrictStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCampuses(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRulesByHostel(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createRule(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateRule(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteRule(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=eligibility.controller.d.ts.map