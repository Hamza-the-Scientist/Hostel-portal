"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
router.get('/profile', (0, auth_1.requireRole)('Student'), student_controller_1.StudentController.getProfile);
router.put('/profile', (0, auth_1.requireRole)('Student'), student_controller_1.StudentController.updateProfile);
router.get('/eligibility-status', (0, auth_1.requireRole)('Student'), student_controller_1.StudentController.getDistrictEligibility);
router.get('/application', (0, auth_1.requireRole)('Student'), student_controller_1.StudentController.getApplication);
router.post('/application', (0, auth_1.requireRole)('Student'), student_controller_1.StudentController.submitApplication);
exports.default = router;
//# sourceMappingURL=student.routes.js.map