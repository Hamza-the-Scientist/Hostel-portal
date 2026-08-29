"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eligibility_controller_1 = require("../controllers/eligibility.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
router.use((0, auth_1.requireRole)('Admin', 'SuperAdmin', 'Provost', 'Warden'));
router.get('/districts', eligibility_controller_1.EligibilityController.getDistricts);
router.get('/districts-management', eligibility_controller_1.EligibilityController.getDistrictsManagement);
router.put('/districts/:id/status', eligibility_controller_1.EligibilityController.updateDistrictStatus);
router.get('/campuses', eligibility_controller_1.EligibilityController.getCampuses);
router.get('/hostel/:hostelId', eligibility_controller_1.EligibilityController.getRulesByHostel);
router.post('/', eligibility_controller_1.EligibilityController.createRule);
router.put('/:id', eligibility_controller_1.EligibilityController.updateRule);
router.delete('/:id', eligibility_controller_1.EligibilityController.deleteRule);
exports.default = router;
//# sourceMappingURL=eligibility.routes.js.map