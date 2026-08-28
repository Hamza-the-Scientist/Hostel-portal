"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/student-login', [
    (0, express_validator_1.body)('cnic').notEmpty().withMessage('CNIC is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], auth_controller_1.AuthController.studentLogin);
router.post('/admin-login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], auth_controller_1.AuthController.adminLogin);
router.post('/register', [
    (0, express_validator_1.body)('cnic').notEmpty().withMessage('CNIC is required'),
    (0, express_validator_1.body)('registrationNumber').notEmpty().withMessage('Registration Number is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], auth_controller_1.AuthController.registerStudent);
// Alias route for student registration
router.post('/student-register', auth_controller_1.AuthController.registerStudent);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map