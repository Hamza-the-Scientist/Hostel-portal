import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  static async studentLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cnic, password } = req.body;
      if (!cnic || !password) {
        res.status(400).json({ message: 'CNIC and password are required.' });
        return;
      }

      const result = await authService.loginStudent(cnic, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
        return;
      }

      const result = await authService.loginAdmin(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async registerStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cnic, registrationNumber, email, password } = req.body;
      if (!cnic || !registrationNumber || !email || !password) {
        res.status(400).json({ message: 'CNIC, Registration Number, Email, and Password are required.' });
        return;
      }

      const result = await authService.registerStudent(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
