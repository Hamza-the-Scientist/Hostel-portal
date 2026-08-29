"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const database_1 = require("../config/database");
const Student_1 = require("../entities/Student");
const StudentProfile_1 = require("../entities/StudentProfile");
const District_1 = require("../entities/District");
const Application_1 = require("../entities/Application");
const ApplicationHostelPreference_1 = require("../entities/ApplicationHostelPreference");
const AcademicYear_1 = require("../entities/AcademicYear");
class StudentService {
    constructor() {
        this.studentRepo = database_1.AppDataSource.getRepository(Student_1.Student);
        this.profileRepo = database_1.AppDataSource.getRepository(StudentProfile_1.StudentProfile);
    }
    async getProfile(userId) {
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
    async updateProfile(userId, body) {
        const student = await this.studentRepo.findOne({
            where: { userId },
            relations: ['user', 'profile'],
        });
        if (!student) {
            throw { status: 404, message: 'Student profile not found.' };
        }
        if (body.phoneNumber !== undefined) {
            student.user.phoneNumber = body.phoneNumber;
            await database_1.AppDataSource.getRepository('User').save(student.user);
        }
        let profile = student.profile;
        if (!profile) {
            profile = this.profileRepo.create({ studentId: student.studentId });
        }
        if (body.guardianName !== undefined)
            profile.guardianName = body.guardianName;
        if (body.guardianPhone !== undefined)
            profile.guardianPhone = body.guardianPhone;
        if (body.guardianRelation !== undefined)
            profile.guardianRelation = body.guardianRelation;
        if (body.homeAddress !== undefined || body.permanentAddress !== undefined) {
            profile.homeAddress = body.permanentAddress || body.homeAddress;
        }
        if (body.city !== undefined)
            profile.city = body.city;
        if (body.emergencyContact !== undefined)
            profile.emergencyContact = body.emergencyContact;
        if (body.bloodGroup !== undefined)
            profile.bloodGroup = body.bloodGroup;
        if (body.disabilities !== undefined || body.specialAccommodation !== undefined) {
            profile.disabilities = body.specialAccommodation || body.disabilities;
        }
        if (body.profilePictureUrl !== undefined)
            profile.photoUrl = body.profilePictureUrl;
        await this.profileRepo.save(profile);
        return this.getProfile(userId);
    }
    async getDistrictEligibility(userId) {
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
        }
        else if (student.districtId) {
            const districtRepo = database_1.AppDataSource.getRepository(District_1.District);
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
    async getApplication(userId) {
        const student = await this.studentRepo.findOne({
            where: { userId },
            relations: ['district', 'applications', 'applications.preferences', 'applications.preferences.hostel', 'user'],
        });
        if (!student) {
            throw { status: 404, message: 'Student not found.' };
        }
        const districtStatus = await this.getDistrictEligibility(userId);
        const appRepo = database_1.AppDataSource.getRepository(Application_1.Application);
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
    async submitApplication(userId, body) {
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
        const appRepo = database_1.AppDataSource.getRepository(Application_1.Application);
        const academicYearRepo = database_1.AppDataSource.getRepository(AcademicYear_1.AcademicYear);
        const prefRepo = database_1.AppDataSource.getRepository(ApplicationHostelPreference_1.ApplicationHostelPreference);
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
        }
        else {
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
}
exports.StudentService = StudentService;
//# sourceMappingURL=student.service.js.map