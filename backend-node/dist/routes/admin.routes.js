"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const eligibility_controller_1 = require("../controllers/eligibility.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
router.use((0, auth_1.requireRole)('Admin', 'SuperAdmin', 'Provost', 'Warden'));
router.get('/dashboard', admin_controller_1.AdminController.getDashboardStats);
router.get('/allocation/status', admin_controller_1.AdminController.getAllocationStatus);
router.put('/allocation/status', admin_controller_1.AdminController.setAllocationStatus);
router.get('/students', admin_controller_1.AdminController.getStudents);
router.get('/districts', eligibility_controller_1.EligibilityController.getDistrictsManagement);
router.put('/districts/:id/status', eligibility_controller_1.EligibilityController.updateDistrictStatus);
router.get('/hostels', admin_controller_1.AdminController.getHostels);
router.post('/hostels', admin_controller_1.AdminController.createHostel);
router.put('/hostels/:id', admin_controller_1.AdminController.updateHostel);
router.delete('/hostels/:id', admin_controller_1.AdminController.deleteHostel);
// Residents
router.get('/residents', admin_controller_1.AdminController.getResidents);
router.post('/residents/:id/challan', admin_controller_1.AdminController.assignChallan);
router.get('/residents/:id/room-history', admin_controller_1.AdminController.getRoomHistory);
router.get('/residents/:id/room-change', admin_controller_1.AdminController.getRoomChangeRequest);
router.post('/residents/:id/room-change/:requestId/approve', admin_controller_1.AdminController.approveRoomChange);
router.post('/residents/:id/room-change/:requestId/reject', admin_controller_1.AdminController.rejectRoomChange);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map