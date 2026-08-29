"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityController = void 0;
const database_1 = require("../config/database");
const EligibilityRule_1 = require("../entities/EligibilityRule");
const eligibility_service_1 = require("../services/eligibility.service");
class EligibilityController {
    static async getDistricts(req, res, next) {
        try {
            const districts = await eligibility_service_1.EligibilityService.getDistricts();
            res.json(districts);
        }
        catch (error) {
            next(error);
        }
    }
    static async getDistrictsManagement(req, res, next) {
        try {
            const districts = await eligibility_service_1.EligibilityService.getDistrictsManagement();
            res.json(districts);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateDistrictStatus(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const { isAllowed } = req.body;
            if (isAllowed === undefined) {
                res.status(400).json({ message: 'isAllowed is required' });
                return;
            }
            const updated = await eligibility_service_1.EligibilityService.updateDistrictStatus(id, Boolean(isAllowed));
            res.json(updated);
        }
        catch (error) {
            next(error);
        }
    }
    static async getCampuses(req, res, next) {
        try {
            const campuses = await eligibility_service_1.EligibilityService.getCampuses();
            res.json(campuses);
        }
        catch (error) {
            next(error);
        }
    }
    static async getRulesByHostel(req, res, next) {
        try {
            const hostelId = parseInt(req.params.hostelId, 10);
            const ruleRepo = database_1.AppDataSource.getRepository(EligibilityRule_1.EligibilityRule);
            const rules = await ruleRepo.find({ where: { hostelId }, order: { createdAt: 'ASC' } });
            res.json(rules);
        }
        catch (error) {
            next(error);
        }
    }
    static async createRule(req, res, next) {
        try {
            const { hostelId, ruleType, mode, values, isActive } = req.body;
            // Validation
            if (!hostelId || !ruleType || !mode) {
                res.status(400).json({ message: 'hostelId, ruleType, and mode are required.' });
                return;
            }
            if (!values || !Array.isArray(values) || values.length === 0) {
                res.status(400).json({ message: 'At least one value is required.' });
                return;
            }
            const ruleRepo = database_1.AppDataSource.getRepository(EligibilityRule_1.EligibilityRule);
            const newRule = ruleRepo.create({
                hostelId,
                ruleType,
                mode,
                values,
                isActive: isActive !== false,
            });
            const savedRule = await ruleRepo.save(newRule);
            res.status(201).json(savedRule);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateRule(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const ruleRepo = database_1.AppDataSource.getRepository(EligibilityRule_1.EligibilityRule);
            const rule = await ruleRepo.findOne({ where: { ruleId: id } });
            if (!rule) {
                res.status(404).json({ message: 'Rule not found' });
                return;
            }
            // Allow partial update
            if (req.body.ruleType !== undefined)
                rule.ruleType = req.body.ruleType;
            if (req.body.mode !== undefined)
                rule.mode = req.body.mode;
            if (req.body.values !== undefined)
                rule.values = req.body.values;
            if (req.body.isActive !== undefined)
                rule.isActive = req.body.isActive;
            const updatedRule = await ruleRepo.save(rule);
            res.json(updatedRule);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteRule(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const ruleRepo = database_1.AppDataSource.getRepository(EligibilityRule_1.EligibilityRule);
            const rule = await ruleRepo.findOne({ where: { ruleId: id } });
            if (!rule) {
                res.status(404).json({ message: 'Rule not found' });
                return;
            }
            await ruleRepo.remove(rule);
            res.json({ message: 'Rule deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EligibilityController = EligibilityController;
//# sourceMappingURL=eligibility.controller.js.map