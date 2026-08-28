"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const database_1 = require("../config/database");
const Student_1 = require("../entities/Student");
const StudentProfile_1 = require("../entities/StudentProfile");
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
}
exports.StudentService = StudentService;
//# sourceMappingURL=student.service.js.map