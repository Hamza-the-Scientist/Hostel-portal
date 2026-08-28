"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const announcement_service_1 = require("../services/announcement.service");
const announcementService = new announcement_service_1.AnnouncementService();
class AnnouncementController {
    static async getPublicAnnouncements(req, res, next) {
        try {
            const announcements = await announcementService.getPublicAnnouncements();
            res.json(announcements);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllAnnouncements(req, res, next) {
        try {
            const announcements = await announcementService.getAllAnnouncements();
            res.json(announcements);
        }
        catch (error) {
            next(error);
        }
    }
    static async createAnnouncement(req, res, next) {
        try {
            const userId = req.user?.userId || 1;
            const announcement = await announcementService.createAnnouncement(userId, req.body);
            res.status(201).json(announcement);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateAnnouncement(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const updated = await announcementService.updateAnnouncement(id, req.body);
            res.json(updated);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteAnnouncement(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await announcementService.deleteAnnouncement(id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnnouncementController = AnnouncementController;
//# sourceMappingURL=announcement.controller.js.map