"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
router.use((0, auth_1.requireRole)('Admin', 'SuperAdmin'));
router.get('/dashboard', admin_controller_1.AdminController.getDashboardStats);
router.get('/allocation/status', admin_controller_1.AdminController.getAllocationStatus);
router.put('/allocation/status', admin_controller_1.AdminController.setAllocationStatus);
router.get('/students', admin_controller_1.AdminController.getStudents);
router.get('/hostels', admin_controller_1.AdminController.getHostels);
router.post('/hostels', admin_controller_1.AdminController.createHostel);
router.put('/hostels/:id', admin_controller_1.AdminController.updateHostel);
router.delete('/hostels/:id', admin_controller_1.AdminController.deleteHostel);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map