"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = require("../config/database");
const Student_1 = require("../entities/Student");
const Resident_1 = require("../entities/Resident");
const Application_1 = require("../entities/Application");
const Bed_1 = require("../entities/Bed");
const Hostel_1 = require("../entities/Hostel");
const HostelAmenity_1 = require("../entities/HostelAmenity");
const HostelImage_1 = require("../entities/HostelImage");
const AdminSettings_1 = require("../entities/AdminSettings");
const RoomChangeRequest_1 = require("../entities/RoomChangeRequest");
const Complaint_1 = require("../entities/Complaint");
const Allocation_1 = require("../entities/Allocation");
const ApplicationHostelPreference_1 = require("../entities/ApplicationHostelPreference");
class AdminService {
    constructor() {
        this.studentRepo = database_1.AppDataSource.getRepository(Student_1.Student);
        this.residentRepo = database_1.AppDataSource.getRepository(Resident_1.Resident);
        this.appRepo = database_1.AppDataSource.getRepository(Application_1.Application);
        this.bedRepo = database_1.AppDataSource.getRepository(Bed_1.Bed);
        this.hostelRepo = database_1.AppDataSource.getRepository(Hostel_1.Hostel);
        this.amenityRepo = database_1.AppDataSource.getRepository(HostelAmenity_1.HostelAmenity);
        this.imageRepo = database_1.AppDataSource.getRepository(HostelImage_1.HostelImage);
        this.settingsRepo = database_1.AppDataSource.getRepository(AdminSettings_1.AdminSettings);
        this.roomChangeRepo = database_1.AppDataSource.getRepository(RoomChangeRequest_1.RoomChangeRequest);
        this.complaintRepo = database_1.AppDataSource.getRepository(Complaint_1.Complaint);
        this.allocRepo = database_1.AppDataSource.getRepository(Allocation_1.Allocation);
    }
    async getDashboardStats() {
        const totalStudents = await this.studentRepo.count();
        const totalResidents = await this.residentRepo.count();
        const totalApplicants = await this.appRepo.count();
        let totalBeds = await this.bedRepo.count();
        if (totalBeds === 0) {
            const result = await this.hostelRepo
                .createQueryBuilder('hostel')
                .select('SUM(hostel.totalCapacity)', 'sum')
                .getRawOne();
            totalBeds = parseInt(result?.sum || '0', 10);
        }
        const activeAllocations = await this.allocRepo.count({ where: { isActive: true } });
        const availableSeats = Math.max(0, totalBeds - activeAllocations);
        const pendingApplications = await this.appRepo.count({
            where: [{ status: 'Submitted' }, { status: 'Draft' }, { status: 'UnderReview' }],
        });
        const roomChangeRequests = await this.roomChangeRepo.count();
        const openComplaints = await this.complaintRepo.count({ where: { status: 'Open' } });
        return {
            totalStudents,
            totalResidents,
            totalApplicants,
            availableSeats,
            pendingApplications,
            pendingPayments: 0,
            roomChangeRequests,
            openComplaints,
        };
    }
    async getAllocationStatus() {
        let settings = await this.settingsRepo.findOne({ where: {} });
        if (!settings) {
            settings = this.settingsRepo.create({
                allocationOpen: true,
                allocationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                effectiveFrom: new Date(),
            });
            await this.settingsRepo.save(settings);
        }
        return {
            open: settings.allocationOpen,
            deadline: settings.allocationDeadline ? settings.allocationDeadline.toISOString() : null,
        };
    }
    async setAllocationStatus(open) {
        let settings = await this.settingsRepo.findOne({ where: {} });
        if (!settings) {
            settings = this.settingsRepo.create({
                allocationOpen: open,
                allocationEnabled: open,
                effectiveFrom: new Date(),
            });
        }
        else {
            settings.allocationOpen = open;
            settings.allocationEnabled = open;
        }
        await this.settingsRepo.save(settings);
        return {
            open: settings.allocationOpen,
            deadline: settings.allocationDeadline ? settings.allocationDeadline.toISOString() : null,
        };
    }
    async getStudents(query) {
        const qb = this.studentRepo
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('student.district', 'district')
            .leftJoinAndSelect('student.universityRecord', 'univRecord')
            .leftJoinAndSelect('univRecord.department', 'dept')
            .leftJoinAndSelect('univRecord.program', 'prog');
        if (query.cnic) {
            qb.andWhere('student.cnic LIKE :cnic', { cnic: `%${query.cnic.trim()}%` });
        }
        if (query.rollNumber) {
            qb.andWhere('student.registrationNumber LIKE :roll', { roll: `%${query.rollNumber.trim()}%` });
        }
        if (query.name) {
            qb.andWhere('CONCAT(user.firstName, " ", user.lastName) LIKE :name', { name: `%${query.name.trim()}%` });
        }
        const students = await qb.getMany();
        return students.map((s) => ({
            studentId: s.studentId,
            cnic: s.cnic,
            rollNumber: s.registrationNumber,
            name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim(),
            department: s.universityRecord?.department?.name || 'Computer Science',
            academicYear: s.universityRecord?.semester ? `Semester ${s.universityRecord.semester}` : '2025-2026',
            district: s.district?.name || 'Jamshoro',
            gender: s.gender,
        }));
    }
    async getHostels() {
        const hostels = await this.hostelRepo.find({
            relations: ['amenities', 'images'],
        });
        return hostels.map((h) => {
            const roomCount = h.totalCapacity > 0 ? h.totalCapacity : 50;
            const allotedCount = Math.round(roomCount * 0.65);
            const availableCount = Math.max(0, roomCount - allotedCount);
            return {
                hostelId: h.hostelId,
                name: h.name,
                gender: h.gender,
                address: h.address || '',
                description: h.description || '',
                eligibilityRequirement: h.eligibilityRequirement || '',
                totalRooms: roomCount,
                allotedRooms: allotedCount,
                availableRooms: availableCount,
                amenities: h.amenities ? h.amenities.map((a) => a.amenityName) : [],
                images: h.images ? h.images.map((i) => i.imageUrl) : [],
                isActive: h.isActive,
            };
        });
    }
    async createHostel(body) {
        const hostel = this.hostelRepo.create({
            name: body.name,
            gender: body.gender || 'Male',
            address: body.address || '',
            description: body.description || '',
            eligibilityRequirement: body.eligibilityRequirement || '',
            totalCapacity: body.totalRooms || 0,
            isActive: true,
        });
        await this.hostelRepo.save(hostel);
        if (body.amenities && body.amenities.length > 0) {
            const amenities = body.amenities
                .filter((a) => a && a.trim())
                .map((a) => this.amenityRepo.create({ hostelId: hostel.hostelId, amenityName: a.trim() }));
            await this.amenityRepo.save(amenities);
        }
        if (body.images && body.images.length > 0) {
            const images = body.images
                .filter((img) => img && img.trim())
                .map((img, idx) => this.imageRepo.create({
                hostelId: hostel.hostelId,
                imageUrl: img.trim(),
                isPrimary: idx === 0,
            }));
            await this.imageRepo.save(images);
        }
        return this.getHostelById(hostel.hostelId);
    }
    async updateHostel(id, body) {
        const hostel = await this.hostelRepo.findOne({ where: { hostelId: id } });
        if (!hostel) {
            throw { status: 404, message: 'Hostel not found' };
        }
        hostel.name = body.name;
        if (body.gender)
            hostel.gender = body.gender;
        if (body.address !== undefined)
            hostel.address = body.address;
        if (body.description !== undefined)
            hostel.description = body.description;
        if (body.eligibilityRequirement !== undefined)
            hostel.eligibilityRequirement = body.eligibilityRequirement;
        if (body.totalRooms !== undefined)
            hostel.totalCapacity = body.totalRooms;
        await this.hostelRepo.save(hostel);
        // Update amenities
        await this.amenityRepo.delete({ hostelId: id });
        if (body.amenities && body.amenities.length > 0) {
            const amenities = body.amenities
                .filter((a) => a && a.trim())
                .map((a) => this.amenityRepo.create({ hostelId: id, amenityName: a.trim() }));
            await this.amenityRepo.save(amenities);
        }
        // Update images
        await this.imageRepo.delete({ hostelId: id });
        if (body.images && body.images.length > 0) {
            const images = body.images
                .filter((img) => img && img.trim())
                .map((img, idx) => this.imageRepo.create({
                hostelId: id,
                imageUrl: img.trim(),
                isPrimary: idx === 0,
            }));
            await this.imageRepo.save(images);
        }
        return this.getHostelById(id);
    }
    async deleteHostel(id) {
        const hostel = await this.hostelRepo.findOne({ where: { hostelId: id } });
        if (!hostel) {
            throw { status: 404, message: 'Hostel not found' };
        }
        // Delete associated child records before removing hostel
        await this.amenityRepo.delete({ hostelId: id });
        await this.imageRepo.delete({ hostelId: id });
        const prefRepo = database_1.AppDataSource.getRepository(ApplicationHostelPreference_1.ApplicationHostelPreference);
        await prefRepo.delete({ hostelId: id });
        // Permanent Hard Delete from database
        await this.hostelRepo.remove(hostel);
        return { message: 'Hostel permanently deleted successfully' };
    }
    async getHostelById(id) {
        const h = await this.hostelRepo.findOne({
            where: { hostelId: id },
            relations: ['amenities', 'images'],
        });
        if (!h)
            throw { status: 404, message: 'Hostel not found' };
        return {
            hostelId: h.hostelId,
            name: h.name,
            gender: h.gender,
            address: h.address || '',
            description: h.description || '',
            eligibilityRequirement: h.eligibilityRequirement || '',
            totalRooms: h.totalCapacity,
            amenities: h.amenities ? h.amenities.map((a) => a.amenityName) : [],
            images: h.images ? h.images.map((i) => i.imageUrl) : [],
            isActive: h.isActive,
        };
    }
    async getResidents(filter = {}) {
        const qb = this.residentRepo.createQueryBuilder('resident')
            .leftJoinAndSelect('resident.allocation', 'allocation')
            .leftJoinAndSelect('allocation.student', 'student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('student.universityRecord', 'univRecord')
            .leftJoinAndSelect('univRecord.department', 'dept')
            .leftJoinAndSelect('student.district', 'district')
            .leftJoinAndSelect('allocation.application', 'application')
            .leftJoinAndSelect('application.academicYear', 'academicYear')
            .leftJoinAndSelect('allocation.bed', 'bed')
            .leftJoinAndSelect('bed.room', 'room')
            .leftJoinAndSelect('room.floor', 'floor')
            .leftJoinAndSelect('floor.block', 'block')
            .leftJoinAndSelect('block.hostel', 'hostel')
            .where('resident.isCurrentResident = :isCurrent', { isCurrent: true })
            .andWhere('allocation.isActive = :isActive', { isActive: true });
        if (filter.name) {
            qb.andWhere('CONCAT(user.firstName, " ", user.lastName) LIKE :name', { name: `%${filter.name}%` });
        }
        if (filter.rollNumber) {
            qb.andWhere('student.registrationNumber LIKE :roll', { roll: `%${filter.rollNumber}%` });
        }
        if (filter.cnic) {
            qb.andWhere('student.cnic LIKE :cnic', { cnic: `%${filter.cnic}%` });
        }
        if (filter.hostelId && filter.hostelId !== 'all') {
            qb.andWhere('hostel.hostelId = :hid', { hid: filter.hostelId });
        }
        const residents = await qb.getMany();
        const challanRepo = database_1.AppDataSource.getRepository('Challans');
        return Promise.all(residents.map(async (r) => {
            const s = r.allocation.student;
            const b = r.allocation.bed;
            let feeStatus = 'Pending';
            const yearName = r.allocation.application?.academicYear?.label || '2025-26';
            const challan = await challanRepo.findOne({
                where: { challanNumber: `ANNUAL-${s.studentId}-${yearName}` }
            });
            if (challan)
                feeStatus = 'Unpaid'; // Simplification
            return {
                residentId: r.residentId,
                studentId: s.studentId,
                studentName: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim(),
                cnic: s.cnic,
                rollNumber: s.registrationNumber,
                department: s.universityRecord?.department?.name || 'Unknown',
                district: s.district?.name || 'Unknown',
                gender: s.gender,
                hostelId: b.room?.floor?.block?.hostel?.hostelId,
                hostelName: b.room?.floor?.block?.hostel?.name || 'Unknown',
                block: b.room?.floor?.block?.blockName || 'Unknown',
                room: b.room?.roomNumber || 'Unknown',
                bed: b.bedLabel || b.bedId.toString(),
                academicYear: yearName,
                annualFeeStatus: feeStatus,
                annualFeeAmount: 25000,
                status: 'Active'
            };
        }));
    }
    async generateAnnualChallan(studentId, amount) {
        const s = await this.studentRepo.findOne({ where: { studentId } });
        if (!s)
            throw { status: 404, message: 'Student not found' };
        const challanRepo = database_1.AppDataSource.getRepository('Challans');
        const challanNum = `ANNUAL-${studentId}-2025-26`; // Simplified academic year logic
        const existing = await challanRepo.findOne({ where: { challanNumber: challanNum } });
        if (existing) {
            throw { status: 400, message: 'Annual challan already exists for this academic year.' };
        }
        const newChallan = challanRepo.create({
            feeId: 1,
            challanNumber: challanNum,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        await challanRepo.save(newChallan);
        return { success: true, challanNumber: challanNum };
    }
    async getRoomHistory(studentId) {
        const allocations = await this.allocRepo.find({
            where: { studentId },
            relations: ['bed', 'bed.room', 'bed.room.floor', 'bed.room.floor.block', 'bed.room.floor.block.hostel', 'application', 'application.academicYear'],
            order: { createdAt: 'DESC' }
        });
        return allocations.map(a => ({
            historyId: a.allocationId,
            date: a.allocatedAt ? new Date(a.allocatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
            hostel: a.bed?.room?.floor?.block?.hostel?.name || 'Unknown',
            block: a.bed?.room?.floor?.block?.blockName || 'Unknown',
            room: a.bed?.room?.roomNumber || 'Unknown',
            bed: a.bed?.bedLabel || 'Unknown',
            action: a.isActive ? 'Current Allocation' : 'Previous Allocation',
            status: a.isActive ? 'Current' : 'Previous'
        }));
    }
    async getRoomChangeRequest(studentId) {
        const r = await this.residentRepo.findOne({
            where: { isCurrentResident: true, allocation: { studentId } },
            relations: ['allocation', 'allocation.bed', 'allocation.bed.room', 'allocation.bed.room.floor', 'allocation.bed.room.floor.block', 'allocation.bed.room.floor.block.hostel']
        });
        if (!r)
            return null;
        const req = await this.roomChangeRepo.findOne({
            where: { residentId: r.residentId, status: 'Pending' }
        });
        if (!req)
            return null;
        let requestedRoomInfo = null;
        if (req.requestedRoomId) {
            const room = await database_1.AppDataSource.getRepository('Rooms').findOne({
                where: { roomId: req.requestedRoomId },
                relations: ['floor', 'floor.block', 'floor.block.hostel', 'beds']
            });
            if (room) {
                requestedRoomInfo = {
                    hostel: room.floor?.block?.hostel?.name,
                    block: room.floor?.block?.blockName,
                    room: room.roomNumber,
                    bed: 'Any Available'
                };
            }
        }
        return {
            requestId: req.requestId,
            requestDate: req.createdAt,
            reason: req.reason,
            currentRoom: {
                hostel: r.allocation?.bed?.room?.floor?.block?.hostel?.name,
                block: r.allocation?.bed?.room?.floor?.block?.blockName,
                room: r.allocation?.bed?.room?.roomNumber,
                bed: r.allocation?.bed?.bedLabel
            },
            requestedRoom: requestedRoomInfo
        };
    }
    async approveRoomChange(studentId, requestId) {
        const req = await this.roomChangeRepo.findOne({ where: { requestId } });
        if (!req)
            throw { status: 404, message: 'Request not found' };
        if (req.status !== 'Pending')
            throw { status: 400, message: 'Request is not pending' };
        req.status = 'Approved';
        await this.roomChangeRepo.save(req);
        return { success: true };
    }
    async rejectRoomChange(studentId, requestId, reason) {
        const req = await this.roomChangeRepo.findOne({ where: { requestId } });
        if (!req)
            throw { status: 404, message: 'Request not found' };
        if (req.status !== 'Pending')
            throw { status: 400, message: 'Request is not pending' };
        req.status = 'Rejected';
        req.reason = reason;
        await this.roomChangeRepo.save(req);
        return { success: true };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map