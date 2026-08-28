"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    static async studentLogin(req, res, next) {
        try {
            const { cnic, password } = req.body;
            if (!cnic || !password) {
                res.status(400).json({ message: 'CNIC and password are required.' });
                return;
            }
            const result = await authService.loginStudent(cnic, password);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required.' });
                return;
            }
            const result = await authService.loginAdmin(email, password);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async registerStudent(req, res, next) {
        try {
            const { cnic, registrationNumber, email, password } = req.body;
            if (!cnic || !registrationNumber || !email || !password) {
                res.status(400).json({ message: 'CNIC, Registration Number, Email, and Password are required.' });
                return;
            }
            const result = await authService.registerStudent(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map