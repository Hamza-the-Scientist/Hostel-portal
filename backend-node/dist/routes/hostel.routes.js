"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hostel_controller_1 = require("../controllers/hostel.controller");
const router = (0, express_1.Router)();
router.get('/', hostel_controller_1.HostelController.getPublicHostels);
router.get('/:id', hostel_controller_1.HostelController.getPublicHostelById);
exports.default = router;
//# sourceMappingURL=hostel.routes.js.map