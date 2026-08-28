"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const announcement_controller_1 = require("../controllers/announcement.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', announcement_controller_1.AnnouncementController.getPublicAnnouncements);
router.get('/all', auth_1.authenticateJWT, (0, auth_1.requireRole)('Admin', 'SuperAdmin'), announcement_controller_1.AnnouncementController.getAllAnnouncements);
router.post('/', auth_1.authenticateJWT, (0, auth_1.requireRole)('Admin', 'SuperAdmin'), announcement_controller_1.AnnouncementController.createAnnouncement);
router.put('/:id', auth_1.authenticateJWT, (0, auth_1.requireRole)('Admin', 'SuperAdmin'), announcement_controller_1.AnnouncementController.updateAnnouncement);
router.delete('/:id', auth_1.authenticateJWT, (0, auth_1.requireRole)('Admin', 'SuperAdmin'), announcement_controller_1.AnnouncementController.deleteAnnouncement);
exports.default = router;
//# sourceMappingURL=announcement.routes.js.map