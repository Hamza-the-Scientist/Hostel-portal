import { AppDataSource } from '../config/database';
import { Student } from '../entities/Student';
import { StudentProfile } from '../entities/StudentProfile';
import { District } from '../entities/District';
import { Application } from '../entities/Application';
import { ApplicationHostelPreference } from '../entities/ApplicationHostelPreference';
import { AcademicYear } from '../entities/AcademicYear';
import { Allocation } from '../entities/Allocation';
import { UniversityStudentRecord } from '../entities/UniversityStudentRecord';

export class StudentService {
  private studentRepo = AppDataSource.getRepository(Student);
  private profileRepo = AppDataSource.getRepository(StudentProfile);

  async getProfile(userId: number) {
    const student = await this.studentRepo.findOne({
      where: { userId },
      relations: [
        'user',
        'profile',
        'district',
        'universityRecord',
        'universityRecord.department',
        'universityRecord.program',
      ],
    });

    if (!student) {
      throw { status: 404, message: 'Student profile not found.' };
    }

    const record = student.universityRecord;
    const profile = student.profile;

    return {
      studentId: student.studentId,
      verifiedInfo: {
        fullName: `${student.user.firstName} ${student.user.lastName}`.trim(),
        rollNumber: student.registrationNumber,
        cnic: student.cnic,
        department: record?.department?.name || 'Computer Science',
        program: record?.program?.name || 'BS Computer Science',
        semester: record?.semester || 1,
        cgpa: record?.cgpa || 0.0,
        academicYear: '2025-2026',
        district: student.district?.name || 'Jamshoro',
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
      },
      personalInfo: {
        email: student.user.email,
        phoneNumber: student.user.phoneNumber || '',
        profilePictureUrl: profile?.photoUrl || null,
        guardianName: profile?.guardianName || null,
        guardianPhone: profile?.guardianPhone || null,
        guardianRelation: profile?.guardianRelation || null,
        homeAddress: profile?.homeAddress || null,
        permanentAddress: profile?.homeAddress || null,
        city: profile?.city || null,
        emergencyContact: profile?.emergencyContact || null,
        bloodGroup: profile?.bloodGroup || null,
        disabilities: profile?.disabilities || null,
        specialAccommodation: profile?.disabilities || null,
      },
    };
  }

  async updateProfile(userId: number, body: any) {
    const student = await this.studentRepo.findOne({
      where: { userId },
      relations: ['user', 'profile'],
    });

    if (!student) {
      throw { status: 404, message: 'Student profile not found.' };
    }

    if (body.phoneNumber !== undefined) {
      student.user.phoneNumber = body.phoneNumber;
      await AppDataSource.getRepository('User').save(student.user);
    }

    let profile = student.profile;
    if (!profile) {
      profile = this.profileRepo.create({ studentId: student.studentId });
    }

    if (body.guardianName !== undefined) profile.guardianName = body.guardianName;
    if (body.guardianPhone !== undefined) profile.guardianPhone = body.guardianPhone;
    if (body.guardianRelation !== undefined) profile.guardianRelation = body.guardianRelation;
    if (body.homeAddress !== undefined || body.permanentAddress !== undefined) {
      profile.homeAddress = body.permanentAddress || body.homeAddress;
    }
    if (body.city !== undefined) profile.city = body.city;
    if (body.emergencyContact !== undefined) profile.emergencyContact = body.emergencyContact;
    if (body.bloodGroup !== undefined) profile.bloodGroup = body.bloodGroup;
    if (body.disabilities !== undefined || body.specialAccommodation !== undefined) {
      profile.disabilities = body.specialAccommodation || body.disabilities;
    }
    if (body.profilePictureUrl !== undefined) profile.photoUrl = body.profilePictureUrl;

    await this.profileRepo.save(profile);

    return this.getProfile(userId);
  }

  async getDistrictEligibility(userId: number) {
    const student = await this.studentRepo.findOne({
      where: { userId },
      relations: ['district'],
    });

    if (!student) {
      throw { status: 404, message: 'Student not found.' };
    }

    let isAllowed = true;
    let districtName = student.district?.name || 'Jamshoro';

    if (student.district) {
      isAllowed = student.district.isAllowed !== false;
    } else if (student.districtId) {
      const districtRepo = AppDataSource.getRepository(District);
      const d = await districtRepo.findOne({ where: { districtId: student.districtId } });
      if (d) {
        districtName = d.name;
        isAllowed = d.isAllowed !== false;
      }
    }

    return {
      isAllowed,
      districtName,
      message: isAllowed
        ? 'Your district is eligible for hostel admission.'
        : `Students from your district (${districtName}) are currently not eligible to apply for hostel accommodation.`,
    };
  }

  async getApplication(userId: number) {
    const student = await this.studentRepo.findOne({
      where: { userId },
      relations: ['district', 'applications', 'applications.preferences', 'applications.preferences.hostel', 'user'],
    });

    if (!student) {
      throw { status: 404, message: 'Student not found.' };
    }

    const districtStatus = await this.getDistrictEligibility(userId);

    const appRepo = AppDataSource.getRepository(Application);
    const app = await appRepo.findOne({
      where: { studentId: student.studentId },
      relations: ['preferences', 'preferences.hostel'],
      order: { createdAt: 'DESC' },
    });

    const isSubmitted = app?.status === 'Submitted';

    return {
      applicationId: app?.applicationId || 101,
      studentId: student.studentId,
      studentName: `${student.user.firstName} ${student.user.lastName}`.trim(),
      rollNumber: student.registrationNumber,
      district: districtStatus.districtName,
      isDistrictAllowed: districtStatus.isAllowed,
      districtEligibilityMessage: districtStatus.message,
      status: app?.status || 'Draft',
      displayStatus: app?.status === 'Submitted' ? 'Submitted' : 'In Progress',
      submittedAt: app?.submittedAt ? app.submittedAt.toISOString() : undefined,
      processingFee: {
        feeId: 501,
        challanNumber: 'CH-2026-0091',
        amount: 100,
        status: 'Paid',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      },
      preferences: app?.preferences?.map((p) => ({
        hostelId: p.hostelId,
        name: p.hostel?.name || `Hostel #${p.hostelId}`,
        gender: p.hostel?.gender || 'Male',
        location: p.hostel?.address || 'Main Campus',
        totalCapacity: p.hostel?.totalCapacity || 300,
        availableBeds: 45,
        rating: 4.5,
        keyAmenities: ['WiFi', 'Mess'],
        isEligible: true,
        eligibilityReason: 'Matches Gender & Academic Program',
      })) || [],
      timeline: [
        { stepName: 'Registration', isCompleted: true, isCurrent: false, description: 'Student verified & registered' },
        { stepName: 'Processing Fee Paid', isCompleted: true, isCurrent: false, description: 'PKR 100 Verified' },
        { stepName: 'Hostel Preferences Submitted', isCompleted: isSubmitted, isCurrent: !isSubmitted, description: isSubmitted ? 'Preferences Submitted' : 'Pending Selection' },
        { stepName: 'Merit Processing', isCompleted: isSubmitted, isCurrent: isSubmitted, description: 'Under Merit Review' },
        { stepName: 'Room Allocated', isCompleted: false, isCurrent: false, description: 'Pending Allocation' },
        { stepName: 'Final Challan', isCompleted: false, isCurrent: false, description: 'Hostel Allotment Fee' },
        { stepName: 'Allocation Complete', isCompleted: false, isCurrent: false, description: 'Resident Card Issued' },
      ],
    };
  }

  async submitApplication(userId: number, body?: any) {
    const student = await this.studentRepo.findOne({
      where: { userId },
      relations: ['district'],
    });

    if (!student) {
      throw { status: 404, message: 'Student profile not found.' };
    }

    // ── STRICT BACKEND SECURITY: DISTRICT-WISE ELIGIBILITY ENFORCEMENT ──
    const districtStatus = await this.getDistrictEligibility(userId);
    if (!districtStatus.isAllowed) {
      throw {
        status: 403,
        message: `Students from your district (${districtStatus.districtName}) are currently not eligible to apply for hostel accommodation.`,
      };
    }

    const appRepo = AppDataSource.getRepository(Application);
    const academicYearRepo = AppDataSource.getRepository(AcademicYear);
    const prefRepo = AppDataSource.getRepository(ApplicationHostelPreference);

    let academicYear = await academicYearRepo.findOne({ where: { isActive: true } });
    if (!academicYear) {
      academicYear = await academicYearRepo.findOne({ where: {} });
    }

    let app = await appRepo.findOne({
      where: { studentId: student.studentId },
    });

    if (!app) {
      app = appRepo.create({
        studentId: student.studentId,
        academicYearId: academicYear?.academicYearId || 1,
        status: 'Submitted',
        submittedAt: new Date(),
      });
    } else {
      app.status = 'Submitted';
      app.submittedAt = new Date();
    }

    const savedApp = await appRepo.save(app);

    // Save preferences if passed in body
    if (body?.preferences && Array.isArray(body.preferences) && body.preferences.length > 0) {
      await prefRepo.delete({ applicationId: savedApp.applicationId });
      for (let i = 0; i < body.preferences.length; i++) {
        const pref = body.preferences[i];
        const newPref = prefRepo.create({
          applicationId: savedApp.applicationId,
          hostelId: pref.hostelId,
          preferenceOrder: pref.priorityOrder || i + 1,
        });
        await prefRepo.save(newPref);
      }
    }

    return this.getApplication(userId);
  }

  async getMeritResult(userId: number) {
    const student = await this.studentRepo.findOne({
      where: { userId },
      relations: [
        'user',
        'district',
        'universityRecord',
        'universityRecord.department',
        'universityRecord.program',
        'applications',
        'applications.preferences',
        'applications.preferences.hostel',
        'allocations',
        'allocations.bed',
        'allocations.bed.room',
        'allocations.bed.room.floor',
        'allocations.bed.room.floor.block',
        'allocations.bed.room.floor.block.hostel',
      ],
    });

    if (!student) {
      throw { status: 404, message: 'Student not found.' };
    }

    const record = student.universityRecord;
    const districtStatus = await this.getDistrictEligibility(userId);

    const appRepo = AppDataSource.getRepository(Application);
    const app = await appRepo.findOne({
      where: { studentId: student.studentId },
      relations: ['preferences', 'preferences.hostel'],
      order: { createdAt: 'DESC' },
    });

    const allocRepo = AppDataSource.getRepository(Allocation);
    const activeAlloc = await allocRepo.findOne({
      where: { studentId: student.studentId, isActive: true },
      relations: ['bed', 'bed.room', 'bed.room.floor', 'bed.room.floor.block', 'bed.room.floor.block.hostel'],
    });

    const totalApplicants = Math.max(15, await appRepo.count());

    // Calculate merit rank based on CGPA
    const cgpa = record?.cgpa || 3.5;
    const univRecordRepo = AppDataSource.getRepository(UniversityStudentRecord);
    const higherCount = await univRecordRepo.createQueryBuilder('rec')
      .where('rec.cgpa > :cgpa', { cgpa })
      .getCount();
    const meritRank = higherCount + 1;

    const cpn = Number((cgpa * 20 + 10).toFixed(2));
    const meritScore = cpn;

    let allocationStatus = 'Pending';
    let allocatedHostel: string | undefined = undefined;
    let allocatedRoom: string | undefined = undefined;
    let allocatedBed: string | undefined = undefined;

    if (activeAlloc && activeAlloc.bed?.room?.floor?.block?.hostel) {
      allocationStatus = 'Allocated';
      allocatedHostel = activeAlloc.bed.room.floor.block.hostel.name;
      allocatedRoom = activeAlloc.bed.room.roomNumber;
      allocatedBed = activeAlloc.bed.bedLabel;
    } else if (app?.status === 'Allocated') {
      allocationStatus = 'Allocated';
      const prefHostel = app.preferences?.[0]?.hostel?.name;
      allocatedHostel = prefHostel || 'Lal Shahbaz Hostel';
      allocatedRoom = '101';
      allocatedBed = 'Bed-1';
    } else if (!districtStatus.isAllowed) {
      allocationStatus = 'Rejected';
    } else if (app?.status === 'Submitted') {
      allocationStatus = 'Pending';
    }

    const preferredHostel = app?.preferences?.[0]?.hostel?.name || undefined;

    let finalChallan: any = undefined;
    if (allocationStatus === 'Allocated') {
      finalChallan = {
        challanId: 700 + student.studentId,
        challanNumber: `CH-HOSTEL-${student.studentId}-2025`,
        amount: 25000,
        status: 'Unpaid',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
        allocatedHostel,
        allocatedRoom,
        allocatedBed,
      };
    }

    return {
      meritId: app?.applicationId || student.studentId,
      applicationId: app?.applicationId || 101,
      studentName: `${student.user.firstName} ${student.user.lastName}`.trim(),
      rollNumber: student.registrationNumber,
      department: record?.department?.name || 'Computer Science',
      program: record?.program?.name || 'BS Computer Science',
      academicYear: '2025-2026',
      gender: student.gender,
      district: districtStatus.districtName,
      cpn,
      cgpa,
      meritScore,
      meritRank,
      totalApplicants,
      isEligible: districtStatus.isAllowed,
      allocationStatus,
      applicationStatus: app?.status || 'Submitted',
      preferredHostel,
      allocatedHostel,
      allocatedRoom,
      allocatedBed,
      finalChallan,
    };
  }

  async getChallans(userId: number) {
    const meritResult = await this.getMeritResult(userId);

    const processingFeeChallan = {
      challanId: 500 + meritResult.meritId,
      challanNumber: `CH-2026-00${meritResult.meritId}`,
      amount: 100,
      status: 'Paid',
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isExpired: false,
    };

    let finalHostelChallan: any = undefined;
    if (meritResult.finalChallan) {
      finalHostelChallan = meritResult.finalChallan;
    } else if (meritResult.allocationStatus === 'Allocated') {
      finalHostelChallan = {
        challanId: 700 + meritResult.meritId,
        challanNumber: `CH-HOSTEL-${meritResult.meritId}-2025`,
        amount: 25000,
        status: 'Unpaid',
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
        allocatedHostel: meritResult.allocatedHostel || 'Lal Shahbaz Hostel',
        allocatedRoom: meritResult.allocatedRoom || '101',
        allocatedBed: meritResult.allocatedBed || 'Bed-1',
      };
    }

    return {
      processingFeeChallan,
      finalHostelChallan,
    };
  }
}

