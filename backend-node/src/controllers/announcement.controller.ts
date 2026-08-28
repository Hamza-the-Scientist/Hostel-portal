import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from '../services/announcement.service';

const announcementService = new AnnouncementService();

export class AnnouncementController {
  static async getPublicAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const announcements = await announcementService.getPublicAnnouncements();
      res.json(announcements);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const announcements = await announcementService.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      next(error);
    }
  }

  static async createAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || 1;
      const announcement = await announcementService.createAnnouncement(userId, req.body);
      res.status(201).json(announcement);
    } catch (error) {
      next(error);
    }
  }

  static async updateAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await announcementService.updateAnnouncement(id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await announcementService.deleteAnnouncement(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
