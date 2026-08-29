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

  static async getRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostelId = parseInt(req.params.hostelId, 10);
      const rooms = await adminService.getRooms(hostelId);
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  }

  static async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostelId = parseInt(req.params.hostelId, 10);
      const room = await adminService.createRoom(hostelId, req.body);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }

  static async updateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostelId = parseInt(req.params.hostelId, 10);
      const roomId = parseInt(req.params.roomId, 10);
      const room = await adminService.updateRoom(hostelId, roomId, req.body);
      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostelId = parseInt(req.params.hostelId, 10);
      const roomId = parseInt(req.params.roomId, 10);
      const result = await adminService.deleteRoom(hostelId, roomId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getResidents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, cnic, rollNumber, hostelId } = req.query;
      const residents = await adminService.getResidents({
        name: name as string,
        cnic: cnic as string,
        rollNumber: rollNumber as string,
        hostelId: hostelId as string,
      });
      res.json(residents);
    } catch (error) {
      next(error);
    }
  }

  static async assignChallan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const residentId = parseInt(req.params.id, 10);
      const { amount } = req.body;
      const result = await adminService.generateAnnualChallan(residentId, amount);
      res.json(result);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ message: error.message });
      else next(error);
    }
  }

  static async getRoomHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const history = await adminService.getRoomHistory(studentId);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  static async getRoomChangeRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const request = await adminService.getRoomChangeRequest(studentId);
      res.json(request);
    } catch (error) {
      next(error);
    }
  }

  static async approveRoomChange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const requestId = parseInt(req.params.requestId, 10);
      const result = await adminService.approveRoomChange(studentId, requestId);
      res.json(result);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ message: error.message });
      else next(error);
    }
  }

  static async rejectRoomChange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = parseInt(req.params.id, 10);
      const requestId = parseInt(req.params.requestId, 10);
      const { reason } = req.body;
      const result = await adminService.rejectRoomChange(studentId, requestId, reason);
      res.json(result);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ message: error.message });
      else next(error);
    }
  }

  static async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await adminService.getSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await adminService.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }
}
