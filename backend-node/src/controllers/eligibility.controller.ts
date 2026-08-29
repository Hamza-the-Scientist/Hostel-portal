import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { EligibilityRule } from '../entities/EligibilityRule';
import { EligibilityService } from '../services/eligibility.service';

export class EligibilityController {
  static async getDistricts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const districts = await EligibilityService.getDistricts();
      res.json(districts);
    } catch (error) {
      next(error);
    }
  }

  static async getCampuses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campuses = await EligibilityService.getCampuses();
      res.json(campuses);
    } catch (error) {
      next(error);
    }
  }

  static async getRulesByHostel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostelId = parseInt(req.params.hostelId, 10);
      const ruleRepo = AppDataSource.getRepository(EligibilityRule);
      const rules = await ruleRepo.find({ where: { hostelId }, order: { createdAt: 'ASC' } });
      res.json(rules);
    } catch (error) {
      next(error);
    }
  }

  static async createRule(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const ruleRepo = AppDataSource.getRepository(EligibilityRule);
      const newRule = ruleRepo.create({
        hostelId,
        ruleType,
        mode,
        values,
        isActive: isActive !== false,
      });
      const savedRule = await ruleRepo.save(newRule);
      res.status(201).json(savedRule);
    } catch (error) {
      next(error);
    }
  }

  static async updateRule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const ruleRepo = AppDataSource.getRepository(EligibilityRule);
      const rule = await ruleRepo.findOne({ where: { ruleId: id } });
      if (!rule) {
        res.status(404).json({ message: 'Rule not found' });
        return;
      }

      // Allow partial update
      if (req.body.ruleType !== undefined) rule.ruleType = req.body.ruleType;
      if (req.body.mode !== undefined) rule.mode = req.body.mode;
      if (req.body.values !== undefined) rule.values = req.body.values;
      if (req.body.isActive !== undefined) rule.isActive = req.body.isActive;

      const updatedRule = await ruleRepo.save(rule);
      res.json(updatedRule);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const ruleRepo = AppDataSource.getRepository(EligibilityRule);
      const rule = await ruleRepo.findOne({ where: { ruleId: id } });
      if (!rule) {
        res.status(404).json({ message: 'Rule not found' });
        return;
      }

      await ruleRepo.remove(rule);
      res.json({ message: 'Rule deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
