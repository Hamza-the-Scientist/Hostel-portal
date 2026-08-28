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
}
