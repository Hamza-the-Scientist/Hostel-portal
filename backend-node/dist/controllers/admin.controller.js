"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const adminService = new admin_service_1.AdminService();
class AdminController {
    static async getDashboardStats(req, res, next) {
        try {
            const stats = await adminService.getDashboardStats();
            res.json(stats);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllocationStatus(req, res, next) {
        try {
            const status = await adminService.getAllocationStatus();
            res.json(status);
        }
        catch (error) {
            next(error);
        }
    }
    static async setAllocationStatus(req, res, next) {
        try {
            const { open } = req.body;
            if (typeof open !== 'boolean') {
                res.status(400).json({ message: 'Property "open" (boolean) is required.' });
                return;
            }
            const updated = await adminService.setAllocationStatus(open);
            res.json(updated);
        }
        catch (error) {
            next(error);
        }
    }
    static async getStudents(req, res, next) {
        try {
            const { name, cnic, rollNumber } = req.query;
            const students = await adminService.getStudents({
                name: name,
                cnic: cnic,
                rollNumber: rollNumber,
            });
            res.json(students);
        }
        catch (error) {
            next(error);
        }
    }
    static async getHostels(req, res, next) {
        try {
            const hostels = await adminService.getHostels();
            res.json(hostels);
        }
        catch (error) {
            next(error);
        }
    }
    static async createHostel(req, res, next) {
        try {
            const hostel = await adminService.createHostel(req.body);
            res.status(201).json(hostel);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateHostel(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const hostel = await adminService.updateHostel(id, req.body);
            res.json(hostel);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteHostel(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await adminService.deleteHostel(id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map