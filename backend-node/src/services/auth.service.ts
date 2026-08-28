import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Student } from '../entities/Student';
import { StudentProfile } from '../entities/StudentProfile';
import { UniversityStudentRecord } from '../entities/UniversityStudentRecord';
import { SimulatedUniversityRecord } from '../entities/SimulatedUniversityRecord';
import { District } from '../entities/District';
import { Department } from '../entities/Department';
import { Program } from '../entities/Program';
import { generateJwtToken } from './jwt.service';

export interface AuthResponseDto {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private studentRepo = AppDataSource.getRepository(Student);
  private simRepo = AppDataSource.getRepository(SimulatedUniversityRecord);
  private districtRepo = AppDataSource.getRepository(District);
  private deptRepo = AppDataSource.getRepository(Department);
  private progRepo = AppDataSource.getRepository(Program);

  async loginStudent(cnic: string, pass: string): Promise<AuthResponseDto> {
    const cleanCnic = cnic.replace(/-/g, '').trim();
    const student = await this.studentRepo.findOne({
      where: { cnic: cleanCnic },
      relations: ['user'],
    });

    if (!student || !student.user) {
      throw { status: 401, message: 'Invalid CNIC or password.' };
    }

    const isValid = await bcrypt.compare(pass, student.user.passwordHash);
    if (!isValid) {
      throw { status: 401, message: 'Invalid CNIC or password.' };
    }

    if (student.user.role !== 'Student') {
      throw { status: 401, message: 'Invalid role.' };
    }

    // Update last login
    student.user.lastLoginAt = new Date();
    await this.userRepo.save(student.user);

    const token = generateJwtToken(student.user);

    return {
      token,
      userId: student.user.userId,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      role: student.user.role,
    };
  }

  async loginAdmin(email: string, pass: string): Promise<AuthResponseDto> {
    const cleanEmail = email.trim().toLowerCase();
    const user = await this.userRepo.findOne({
      where: { email: cleanEmail },
    });

    if (!user) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    const isValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isValid) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    if (user.role !== 'Admin' && user.role !== 'SuperAdmin') {
      throw { status: 401, message: 'Unauthorized access.' };
    }

    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    const token = generateJwtToken(user);

    return {
      token,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  async registerStudent(data: {
    cnic: string;
    registrationNumber: string;
    email: string;
    password: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    dateOfBirth?: string;
  }): Promise<AuthResponseDto> {
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

    const passwordHash = await bcrypt.hash(data.password, 10);

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

    const profileRepo = AppDataSource.getRepository(StudentProfile);
    const newProfile = profileRepo.create({
      studentId: newStudent.studentId,
      homeAddress: simRecord.address,
      city: simRecord.districtName,
      photoUrl: simRecord.profilePictureUrl,
      guardianName: simRecord.fatherName,
    });
    await profileRepo.save(newProfile);

    const recordRepo = AppDataSource.getRepository(UniversityStudentRecord);
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

    const token = generateJwtToken(newUser);

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
