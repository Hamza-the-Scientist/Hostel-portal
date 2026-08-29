import { District } from '../entities/District';
export declare class EligibilityService {
    /**
     * Core eligibility evaluation: checks whether a student passes all active rules for a hostel.
     * - First verifies that the student's district is globally Allowed by Admin.
     * - Rules of different types (District vs Campus) are evaluated as AND.
     * - Values within a single rule are OR.
     * - Exclude rules cause immediate failure if matched.
     * - No active rules = no restriction (eligible).
     */
    static checkEligibility(studentId: number, hostelId: number): Promise<boolean>;
    /** Load district names from the Districts table. */
    static getDistricts(): Promise<string[]>;
    /** Get all districts with full status for Admin management */
    static getDistrictsManagement(): Promise<District[]>;
    /** Update allowed status of a district */
    static updateDistrictStatus(districtId: number, isAllowed: boolean): Promise<District>;
    /** Check if a specific student's district is currently allowed */
    static checkStudentDistrictEligibility(studentId: number): Promise<{
        isAllowed: boolean;
        districtName: string;
        message: string;
    }>;
    /** Return known campus names. */
    static getCampuses(): Promise<string[]>;
}
//# sourceMappingURL=eligibility.service.d.ts.map