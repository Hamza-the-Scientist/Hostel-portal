"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student_service_1 = require("../services/student.service");
const studentService = new student_service_1.StudentService();
class StudentController {
    static async getProfile(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const profile = await studentService.getProfile(userId);
            res.json(profile);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const updatedProfile = await studentService.updateProfile(userId, req.body);
            res.json(updatedProfile);
        }
        catch (error) {
            next(error);
        }
    }
    static async getDistrictEligibility(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const status = await studentService.getDistrictEligibility(userId);
            res.json(status);
        }
        catch (error) {
            next(error);
        }
    }
    static async getApplication(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const app = await studentService.getApplication(userId);
            res.json(app);
        }
        catch (error) {
            next(error);
        }
    }
    static async submitApplication(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const app = await studentService.submitApplication(userId, req.body);
            res.json(app);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StudentController = StudentController;
//# sourceMappingURL=student.controller.js.map