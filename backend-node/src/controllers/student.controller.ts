import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';

const studentService = new StudentService();

export class StudentController {
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const profile = await studentService.getProfile(userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const updatedProfile = await studentService.updateProfile(userId, req.body);
      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  static async getDistrictEligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const status = await studentService.getDistrictEligibility(userId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  static async getApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const app = await studentService.getApplication(userId);
      res.json(app);
    } catch (error) {
      next(error);
    }
  }

  static async submitApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const app = await studentService.submitApplication(userId, req.body);
      res.json(app);
    } catch (error) {
      next(error);
    }
  }

  static async getMeritResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const result = await studentService.getMeritResult(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getChallans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const challans = await studentService.getChallans(userId);
      res.json(challans);
    } catch (error) {
      next(error);
    }
  }
}

