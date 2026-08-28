"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostelController = void 0;
const hostel_service_1 = require("../services/hostel.service");
const hostelService = new hostel_service_1.HostelService();
class HostelController {
    static async getPublicHostels(req, res, next) {
        try {
            const hostels = await hostelService.getPublicHostels();
            res.json(hostels);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPublicHostelById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const hostel = await hostelService.getPublicHostelById(id);
            res.json(hostel);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.HostelController = HostelController;
//# sourceMappingURL=hostel.controller.js.map