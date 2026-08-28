import { Request, Response, NextFunction } from 'express';
import { HostelService } from '../services/hostel.service';

const hostelService = new HostelService();

export class HostelController {
  static async getPublicHostels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostels = await hostelService.getPublicHostels();
      res.json(hostels);
    } catch (error) {
      next(error);
    }
  }

  static async getPublicHostelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const hostel = await hostelService.getPublicHostelById(id);
      res.json(hostel);
    } catch (error) {
      next(error);
    }
  }
}
