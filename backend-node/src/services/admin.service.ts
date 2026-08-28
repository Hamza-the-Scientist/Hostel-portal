import { AppDataSource } from '../config/database';
import { Student } from '../entities/Student';
import { Resident } from '../entities/Resident';
import { Application } from '../entities/Application';
import { Bed } from '../entities/Bed';
import { Hostel } from '../entities/Hostel';
import { HostelAmenity } from '../entities/HostelAmenity';
import { HostelImage } from '../entities/HostelImage';
import { AdminSettings } from '../entities/AdminSettings';
import { RoomChangeRequest } from '../entities/RoomChangeRequest';
import { Complaint } from '../entities/Complaint';
import { Allocation } from '../entities/Allocation';
import { ApplicationHostelPreference } from '../entities/ApplicationHostelPreference';

export class AdminService {
  private studentRepo = AppDataSource.getRepository(Student);
  private residentRepo = AppDataSource.getRepository(Resident);
  private appRepo = AppDataSource.getRepository(Application);
  private bedRepo = AppDataSource.getRepository(Bed);
  private hostelRepo = AppDataSource.getRepository(Hostel);
  private amenityRepo = AppDataSource.getRepository(HostelAmenity);
  private imageRepo = AppDataSource.getRepository(HostelImage);
  private settingsRepo = AppDataSource.getRepository(AdminSettings);
  private roomChangeRepo = AppDataSource.getRepository(RoomChangeRequest);
  private complaintRepo = AppDataSource.getRepository(Complaint);
  private allocRepo = AppDataSource.getRepository(Allocation);

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

  async setAllocationStatus(open: boolean) {
    let settings = await this.settingsRepo.findOne({ where: {} });
    if (!settings) {
      settings = this.settingsRepo.create({
        allocationOpen: open,
        allocationEnabled: open,
        effectiveFrom: new Date(),
      });
    } else {
      settings.allocationOpen = open;
      settings.allocationEnabled = open;
    }

    await this.settingsRepo.save(settings);

    return {
      open: settings.allocationOpen,
      deadline: settings.allocationDeadline ? settings.allocationDeadline.toISOString() : null,
    };
  }

  async getStudents(query: { name?: string; cnic?: string; rollNumber?: string }) {
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

  async createHostel(body: {
    name: string;
    gender?: string;
    address?: string;
    description?: string;
    eligibilityRequirement?: string;
    totalRooms?: number;
    amenities?: string[];
    images?: string[];
  }) {
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
        .map((img, idx) =>
          this.imageRepo.create({
            hostelId: hostel.hostelId,
            imageUrl: img.trim(),
            isPrimary: idx === 0,
          })
        );
      await this.imageRepo.save(images);
    }

    return this.getHostelById(hostel.hostelId);
  }

  async updateHostel(
    id: number,
    body: {
      name: string;
      gender?: string;
      address?: string;
      description?: string;
      eligibilityRequirement?: string;
      totalRooms?: number;
      amenities?: string[];
      images?: string[];
    }
  ) {
    const hostel = await this.hostelRepo.findOne({ where: { hostelId: id } });
    if (!hostel) {
      throw { status: 404, message: 'Hostel not found' };
    }

    hostel.name = body.name;
    if (body.gender) hostel.gender = body.gender;
    if (body.address !== undefined) hostel.address = body.address;
    if (body.description !== undefined) hostel.description = body.description;
    if (body.eligibilityRequirement !== undefined) hostel.eligibilityRequirement = body.eligibilityRequirement;
    if (body.totalRooms !== undefined) hostel.totalCapacity = body.totalRooms;

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
        .map((img, idx) =>
          this.imageRepo.create({
            hostelId: id,
            imageUrl: img.trim(),
            isPrimary: idx === 0,
          })
        );
      await this.imageRepo.save(images);
    }

    return this.getHostelById(id);
  }

  async deleteHostel(id: number) {
    const hostel = await this.hostelRepo.findOne({ where: { hostelId: id } });
    if (!hostel) {
      throw { status: 404, message: 'Hostel not found' };
    }

    // Delete associated child records before removing hostel
    await this.amenityRepo.delete({ hostelId: id });
    await this.imageRepo.delete({ hostelId: id });
    const prefRepo = AppDataSource.getRepository(ApplicationHostelPreference);
    await prefRepo.delete({ hostelId: id });

    // Permanent Hard Delete from database
    await this.hostelRepo.remove(hostel);

    return { message: 'Hostel permanently deleted successfully' };
  }

  private async getHostelById(id: number) {
    const h = await this.hostelRepo.findOne({
      where: { hostelId: id },
      relations: ['amenities', 'images'],
    });

    if (!h) throw { status: 404, message: 'Hostel not found' };

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
}
