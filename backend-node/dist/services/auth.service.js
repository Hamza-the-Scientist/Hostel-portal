"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const Student_1 = require("../entities/Student");
const StudentProfile_1 = require("../entities/StudentProfile");
const UniversityStudentRecord_1 = require("../entities/UniversityStudentRecord");
const SimulatedUniversityRecord_1 = require("../entities/SimulatedUniversityRecord");
const District_1 = require("../entities/District");
const Department_1 = require("../entities/Department");
const Program_1 = require("../entities/Program");
const jwt_service_1 = require("./jwt.service");
class AuthService {
    constructor() {
        this.userRepo = database_1.AppDataSource.getRepository(User_1.User);
        this.studentRepo = database_1.AppDataSource.getRepository(Student_1.Student);
        this.simRepo = database_1.AppDataSource.getRepository(SimulatedUniversityRecord_1.SimulatedUniversityRecord);
        this.districtRepo = database_1.AppDataSource.getRepository(District_1.District);
        this.deptRepo = database_1.AppDataSource.getRepository(Department_1.Department);
        this.progRepo = database_1.AppDataSource.getRepository(Program_1.Program);
    }
    async loginStudent(cnic, pass) {
        const cleanCnic = cnic.replace(/-/g, '').trim();
        const student = await this.studentRepo.findOne({
            where: { cnic: cleanCnic },
            relations: ['user'],
        });
        if (!student || !student.user) {
            throw { status: 401, message: 'Invalid CNIC or password.' };
        }
        const isValid = await bcrypt_1.default.compare(pass, student.user.passwordHash);
        if (!isValid) {
            throw { status: 401, message: 'Invalid CNIC or password.' };
        }
        if (student.user.role !== 'Student') {
            throw { status: 401, message: 'Invalid role.' };
        }
        // Update last login
        student.user.lastLoginAt = new Date();
        await this.userRepo.save(student.user);
        const token = (0, jwt_service_1.generateJwtToken)(student.user);
        return {
            token,
            userId: student.user.userId,
            firstName: student.user.firstName,
            lastName: student.user.lastName,
            email: student.user.email,
            role: student.user.role,
        };
    }
    async loginAdmin(email, pass) {
        const cleanEmail = email.trim().toLowerCase();
        const user = await this.userRepo.findOne({
            where: { email: cleanEmail },
        });
        if (!user) {
            throw { status: 401, message: 'Invalid email or password.' };
        }
        const isValid = await bcrypt_1.default.compare(pass, user.passwordHash);
        if (!isValid) {
            throw { status: 401, message: 'Invalid email or password.' };
        }
        if (user.role !== 'Admin' && user.role !== 'SuperAdmin' && user.role !== 'Provost' && user.role !== 'Warden') {
            throw { status: 401, message: 'Unauthorized access.' };
        }
        user.lastLoginAt = new Date();
        await this.userRepo.save(user);
        const token = (0, jwt_service_1.generateJwtToken)(user);
        return {
            token,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }
    async registerStudent(data) {
        const cleanCnic = data.cnic.replace(/-/g, '').trim();
        const cleanRoll = data.registrationNumber.trim();
        const cleanEmail = data.email.trim().toLowerCase();
        // 1. Check SimulatedUniversityRecords for matching CNIC + registrationNumber
        const simRecord = await this.simRepo.findOne({
            where: [
                { cnic: cleanCnic, rollNumber: cleanRoll },
                { cnic: cleanCnic },
            ],
        });
        if (!simRecord) {
            throw { status: 404, message: 'Student not found in university records' };
        }
        // 2. Check if already registered
        const existingUser = await this.userRepo.findOne({ where: { email: cleanEmail } });
        const existingStudent = await this.studentRepo.findOne({
            where: [{ cnic: cleanCnic }, { registrationNumber: cleanRoll }],
        });
        if (existingUser || existingStudent) {
            throw { status: 409, message: 'Already registered' };
        }
        // 3. Create User + Student + StudentProfile using official details from SimulatedUniversityRecord
        const nameParts = simRecord.fullName.trim().split(' ');
        const officialFirstName = nameParts[0] || 'Student';
        const officialLastName = nameParts.slice(1).join(' ') || '';
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const newUser = this.userRepo.create({
            email: cleanEmail,
            passwordHash,
            firstName: officialFirstName,
            lastName: officialLastName,
            role: 'Student',
            isActive: true,
            phoneNumber: data.phoneNumber || null,
        });
        await this.userRepo.save(newUser);
        // Find or create district
        let district = await this.districtRepo.findOne({ where: { name: simRecord.districtName } });
        if (!district) {
            district = this.districtRepo.create({ name: simRecord.districtName, province: simRecord.province || 'Sindh' });
            await this.districtRepo.save(district);
        }
        // Find or create department & program
        let department = await this.deptRepo.findOne({ where: { name: simRecord.departmentName } });
        if (!department) {
            department = this.deptRepo.create({
                name: simRecord.departmentName,
                code: simRecord.departmentName.substring(0, 5).toUpperCase(),
            });
            await this.deptRepo.save(department);
        }
        let program = await this.progRepo.findOne({ where: { name: simRecord.programName } });
        if (!program) {
            program = this.progRepo.create({
                name: simRecord.programName,
                code: simRecord.programName.substring(0, 5).toUpperCase(),
                departmentId: department.departmentId,
                degreeType: simRecord.degreeType || 'BS',
            });
            await this.progRepo.save(program);
        }
        const newStudent = this.studentRepo.create({
            userId: newUser.userId,
            cnic: simRecord.cnic,
            registrationNumber: simRecord.rollNumber,
            gender: simRecord.gender,
            dateOfBirth: simRecord.dateOfBirth,
            districtId: district.districtId,
        });
        await this.studentRepo.save(newStudent);
        const profileRepo = database_1.AppDataSource.getRepository(StudentProfile_1.StudentProfile);
        const newProfile = profileRepo.create({
            studentId: newStudent.studentId,
            homeAddress: simRecord.address,
            city: simRecord.districtName,
            photoUrl: simRecord.profilePictureUrl,
            guardianName: simRecord.fatherName,
        });
        await profileRepo.save(newProfile);
        const recordRepo = database_1.AppDataSource.getRepository(UniversityStudentRecord_1.UniversityStudentRecord);
        const newRecord = recordRepo.create({
            studentId: newStudent.studentId,
            departmentId: department.departmentId,
            programId: program.programId,
            semester: simRecord.semester,
            cgpa: simRecord.cgpa,
            isVerified: true,
            verifiedAt: new Date(),
            verifiedBy: 'SYSTEM_VERIFICATION_GATE',
        });
        await recordRepo.save(newRecord);
        const token = (0, jwt_service_1.generateJwtToken)(newUser);
        return {
            token,
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map