"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityService = void 0;
const database_1 = require("../config/database");
const EligibilityRule_1 = require("../entities/EligibilityRule");
const Student_1 = require("../entities/Student");
const District_1 = require("../entities/District");
class EligibilityService {
    /**
     * Core eligibility evaluation: checks whether a student passes all active rules for a hostel.
     * - First verifies that the student's district is globally Allowed by Admin.
     * - Rules of different types (District vs Campus) are evaluated as AND.
     * - Values within a single rule are OR.
     * - Exclude rules cause immediate failure if matched.
     * - No active rules = no restriction (eligible).
     */
    static async checkEligibility(studentId, hostelId) {
        const studentRepo = database_1.AppDataSource.getRepository(Student_1.Student);
        const student = await studentRepo.findOne({
            where: { studentId },
            relations: ['district', 'universityRecord'],
        });
        if (!student)
            return false;
        // ── Global Admin District Enforcement ──
        const districtRepo = database_1.AppDataSource.getRepository(District_1.District);
        let district = student.district;
        if (!district && student.districtId) {
            district = await districtRepo.findOne({ where: { districtId: student.districtId } });
        }
        if (district && district.isAllowed === false) {
            return false; // Student's district is disallowed by Admin
        }
        const ruleRepo = database_1.AppDataSource.getRepository(EligibilityRule_1.EligibilityRule);
        const rules = await ruleRepo.find({ where: { hostelId, isActive: true } });
        // No active rules → no restrictions
        if (rules.length === 0)
            return true;
        const districtRules = rules.filter((r) => r.ruleType === 'District');
        const campusRules = rules.filter((r) => r.ruleType === 'Campus');
        const studentDistrict = district?.name || student.district?.name || '';
        // Campus is not directly stored on Student in the current schema.
        // Default to 'Main Campus'; this can be extended when a campus field is added.
        const studentCampus = 'Main Campus';
        // ── Evaluate District rules ──
        if (districtRules.length > 0) {
            const excludeRules = districtRules.filter((r) => r.mode === 'Exclude');
            const includeRules = districtRules.filter((r) => r.mode === 'Include');
            // Exclude takes priority – immediate fail
            for (const rule of excludeRules) {
                if (rule.values && rule.values.includes(studentDistrict)) {
                    return false;
                }
            }
            // Include – student must match at least one value across all include rules
            if (includeRules.length > 0) {
                const matched = includeRules.some((rule) => rule.values && rule.values.includes(studentDistrict));
                if (!matched)
                    return false;
            }
        }
        // ── Evaluate Campus rules ──
        if (campusRules.length > 0) {
            const excludeRules = campusRules.filter((r) => r.mode === 'Exclude');
            const includeRules = campusRules.filter((r) => r.mode === 'Include');
            for (const rule of excludeRules) {
                if (rule.values && rule.values.includes(studentCampus)) {
                    return false;
                }
            }
            if (includeRules.length > 0) {
                const matched = includeRules.some((rule) => rule.values && rule.values.includes(studentCampus));
                if (!matched)
                    return false;
            }
        }
        return true; // Passed all active rules
    }
    /** Load district names from the Districts table. */
    static async getDistricts() {
        const districtRepo = database_1.AppDataSource.getRepository(District_1.District);
        const districts = await districtRepo.find({ order: { name: 'ASC' } });
        return districts.map((d) => d.name);
    }
    /** Get all districts with full status for Admin management */
    static async getDistrictsManagement() {
        const districtRepo = database_1.AppDataSource.getRepository(District_1.District);
        return districtRepo.find({ order: { name: 'ASC' } });
    }
    /** Update allowed status of a district */
    static async updateDistrictStatus(districtId, isAllowed) {
        const districtRepo = database_1.AppDataSource.getRepository(District_1.District);
        const district = await districtRepo.findOne({ where: { districtId } });
        if (!district) {
            throw { status: 404, message: 'District not found.' };
        }
        district.isAllowed = isAllowed;
        return districtRepo.save(district);
    }
    /** Check if a specific student's district is currently allowed */
    static async checkStudentDistrictEligibility(studentId) {
        const studentRepo = database_1.AppDataSource.getRepository(Student_1.Student);
        const student = await studentRepo.findOne({
            where: { studentId },
            relations: ['district'],
        });
        if (!student) {
            return { isAllowed: false, districtName: 'Unknown', message: 'Student profile not found.' };
        }
        let isAllowed = true;
        let districtName = student.district?.name || 'Jamshoro';
        if (student.district) {
            isAllowed = student.district.isAllowed !== false;
        }
        else if (student.districtId) {
            const districtRepo = database_1.AppDataSource.getRepository(District_1.District);
            const d = await districtRepo.findOne({ where: { districtId: student.districtId } });
            if (d) {
                districtName = d.name;
                isAllowed = d.isAllowed !== false;
            }
        }
        return {
            isAllowed,
            districtName,
            message: isAllowed
                ? 'Your district is eligible for hostel admission.'
                : `Students from your district (${districtName}) are currently not eligible to apply for hostel accommodation.`,
        };
    }
    /** Return known campus names. */
    static async getCampuses() {
        return [
            'Main Campus',
            'Old Campus',
            'Mirpurkhas Campus',
            'Larkana Campus',
            'Dadu Campus',
            'Naushahro Feroze Campus',
            'Thatta Campus',
            'Badin Campus',
            'Sujawal Campus',
        ];
    }
}
exports.EligibilityService = EligibilityService;
//# sourceMappingURL=eligibility.service.js.map