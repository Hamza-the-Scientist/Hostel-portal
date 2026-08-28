import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export class AdminController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getAllocationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await adminService.getAllocationStatus();
      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  static async setAllocationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { open } = req.body;
      if (typeof open !== 'boolean') {
        res.status(400).json({ message: 'Property "open" (boolean) is required.' });
        return;
      }

      const updated = await adminService.setAllocationStatus(open);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, cnic, rollNumber } = req.query;
      const students = await adminService.getStudents({
        name: name as string,
        cnic: cnic as string,
        rollNumber: rollNumber as string,
      });
      res.json(students);
    } catch (error) {
      next(error);
    }
  }

  static async getHostels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostels = await adminService.getHostels();
      res.json(hostels);
    } catch (error) {
      next(error);
    }
  }

  static async createHostel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostel = await adminService.createHostel(req.body);
      res.status(201).json(hostel);
    } catch (error) {
      next(error);
    }
  }

  static async updateHostel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const hostel = await adminService.updateHostel(id, req.body);
      res.json(hostel);
    } catch (error) {
      next(error);
    }
  }

  static async deleteHostel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await adminService.deleteHostel(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
