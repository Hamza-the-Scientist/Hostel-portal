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
}
exports.StudentController = StudentController;
//# sourceMappingURL=student.controller.js.map