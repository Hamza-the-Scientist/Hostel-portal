"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const Admin_1 = require("../entities/Admin");
const Student_1 = require("../entities/Student");
const StudentProfile_1 = require("../entities/StudentProfile");
const UniversityStudentRecord_1 = require("../entities/UniversityStudentRecord");
const SimulatedUniversityRecord_1 = require("../entities/SimulatedUniversityRecord");
const District_1 = require("../entities/District");
const Department_1 = require("../entities/Department");
const Program_1 = require("../entities/Program");
const Hostel_1 = require("../entities/Hostel");
const HostelAmenity_1 = require("../entities/HostelAmenity");
const HostelImage_1 = require("../entities/HostelImage");
const AdminSettings_1 = require("../entities/AdminSettings");
const Announcement_1 = require("../entities/Announcement");
const seedDatabase = async () => {
    console.log('🌱 Starting Database Seeding...');
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    const adminRepo = database_1.AppDataSource.getRepository(Admin_1.Admin);
    const simRepo = database_1.AppDataSource.getRepository(SimulatedUniversityRecord_1.SimulatedUniversityRecord);
    const studentRepo = database_1.AppDataSource.getRepository(Student_1.Student);
    const profileRepo = database_1.AppDataSource.getRepository(StudentProfile_1.StudentProfile);
    const univRecordRepo = database_1.AppDataSource.getRepository(UniversityStudentRecord_1.UniversityStudentRecord);
    const districtRepo = database_1.AppDataSource.getRepository(District_1.District);
    const deptRepo = database_1.AppDataSource.getRepository(Department_1.Department);
    const progRepo = database_1.AppDataSource.getRepository(Program_1.Program);
    const hostelRepo = database_1.AppDataSource.getRepository(Hostel_1.Hostel);
    const amenityRepo = database_1.AppDataSource.getRepository(HostelAmenity_1.HostelAmenity);
    const imageRepo = database_1.AppDataSource.getRepository(HostelImage_1.HostelImage);
    const settingsRepo = database_1.AppDataSource.getRepository(AdminSettings_1.AdminSettings);
    const announcementRepo = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
    // 1. Seed Admin User
    const adminEmail = 'admin@usindh.edu.pk';
    let adminUser = await userRepo.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
        const adminPassHash = await bcrypt_1.default.hash('AdminPassword123!', 10);
        adminUser = userRepo.create({
            email: adminEmail,
            passwordHash: adminPassHash,
            firstName: 'Provost',
            lastName: 'Office',
            role: 'Admin',
            isActive: true,
            phoneNumber: '+92 22 9213181',
        });
        await userRepo.save(adminUser);
        const admin = adminRepo.create({
            userId: adminUser.userId,
            employeeId: 'ADM-001',
            department: 'Hostel Administration',
        });
        await adminRepo.save(admin);
        console.log('✅ Admin Account Seeded (Email: admin@usindh.edu.pk | Pass: AdminPassword123!)');
    }
    // 2. Seed AdminSettings
    let settings = await settingsRepo.findOne({ where: {} });
    if (!settings) {
        settings = settingsRepo.create({
            allocationOpen: true,
            allocationEnabled: true,
            allocationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            effectiveFrom: new Date(),
        });
        await settingsRepo.save(settings);
        console.log('✅ AdminSettings Seeded');
    }
    // 3. Seed SimulatedUniversityRecords for Registration Testing
    const demoRecords = [
        {
            cnic: '4130412345671',
            rollNumber: '2K21/CSM/01',
            fullName: 'Ali Ahmed',
            fatherName: 'Ahmed Khan',
            address: 'Qasimabad, Hyderabad',
            districtName: 'Hyderabad',
            departmentName: 'Computer Science',
            programName: 'BS Computer Science',
            cgpa: 3.75,
            cpn: 84.5,
            semester: 6,
            gender: 'Male',
            dateOfBirth: '2002-05-15',
        },
        {
            cnic: '4130412345672',
            rollNumber: '2K21/CSM/02',
            fullName: 'Sara Khan',
            fatherName: 'Tariq Khan',
            address: 'Latifabad, Hyderabad',
            districtName: 'Hyderabad',
            departmentName: 'Software Engineering',
            programName: 'BS Software Engineering',
            cgpa: 3.85,
            cpn: 88.2,
            semester: 6,
            gender: 'Female',
            dateOfBirth: '2002-08-20',
        },
        {
            cnic: '4130412345673',
            rollNumber: '2K21/CSM/03',
            fullName: 'Zubair Shah',
            fatherName: 'Gulam Shah',
            address: 'Saddar, Jamshoro',
            districtName: 'Jamshoro',
            departmentName: 'Information Technology',
            programName: 'BS Information Technology',
            cgpa: 3.4,
            cpn: 79.0,
            semester: 4,
            gender: 'Male',
            dateOfBirth: '2003-01-10',
        },
    ];
    for (const rec of demoRecords) {
        const existing = await simRepo.findOne({ where: { cnic: rec.cnic } });
        if (!existing) {
            const sim = simRepo.create({
                ...rec,
                province: 'Sindh',
                degreeType: 'BS',
                academicYear: '2025-2026',
                profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.fullName.replace(' ', '')}`,
                isActive: true,
            });
            await simRepo.save(sim);
        }
    }
    console.log('✅ Simulated University Records Seeded');
    // 4. Seed Registered Demo Student (for immediate student login test)
    const studentEmail = 'student@usindh.edu.pk';
    let studentUser = await userRepo.findOne({ where: { email: studentEmail } });
    if (!studentUser) {
        const studentPassHash = await bcrypt_1.default.hash('StudentPassword123!', 10);
        studentUser = userRepo.create({
            email: studentEmail,
            passwordHash: studentPassHash,
            firstName: 'Ali',
            lastName: 'Ahmed',
            role: 'Student',
            isActive: true,
            phoneNumber: '+92 300 1234567',
        });
        await userRepo.save(studentUser);
        let district = await districtRepo.findOne({ where: { name: 'Hyderabad' } });
        if (!district) {
            district = districtRepo.create({ name: 'Hyderabad', province: 'Sindh' });
            await districtRepo.save(district);
        }
        let dept = await deptRepo.findOne({ where: { name: 'Computer Science' } });
        if (!dept) {
            dept = deptRepo.create({ name: 'Computer Science', code: 'CS' });
            await deptRepo.save(dept);
        }
        let prog = await progRepo.findOne({ where: { name: 'BS Computer Science' } });
        if (!prog) {
            prog = progRepo.create({
                name: 'BS Computer Science',
                code: 'BSCS',
                departmentId: dept.departmentId,
                degreeType: 'BS',
            });
            await progRepo.save(prog);
        }
        const student = studentRepo.create({
            userId: studentUser.userId,
            cnic: '4130412345671',
            registrationNumber: '2K21/CSM/01',
            gender: 'Male',
            dateOfBirth: '2002-05-15',
            districtId: district.districtId,
        });
        await studentRepo.save(student);
        const profile = profileRepo.create({
            studentId: student.studentId,
            homeAddress: 'Qasimabad, Hyderabad',
            city: 'Hyderabad',
            guardianName: 'Ahmed Khan',
            guardianPhone: '+92 300 7654321',
            guardianRelation: 'Father',
            bloodGroup: 'B+',
            photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AliAhmed',
        });
        await profileRepo.save(profile);
        const record = univRecordRepo.create({
            studentId: student.studentId,
            departmentId: dept.departmentId,
            programId: prog.programId,
            semester: 6,
            cgpa: 3.75,
            isVerified: true,
            verifiedAt: new Date(),
            verifiedBy: 'SYSTEM_INITIALIZER',
        });
        await univRecordRepo.save(record);
        console.log('✅ Demo Student Account Seeded (CNIC: 4130412345671 | Pass: StudentPassword123!)');
    }
    // 5. Seed Hostels
    const hostelsData = [
        {
            name: 'Shah Abdul Latif Male Hostel',
            gender: 'Male',
            totalCapacity: 250,
            address: 'Sector A, Allama I.I. Kazi Campus, Jamshoro',
            description: 'Modern residential hostel for male undergraduate students equipped with study rooms, high-speed Wi-Fi, and 24/7 security.',
            eligibilityRequirement: 'Must be enrolled in 1st to 8th Semester BS/BE Program.',
            warden: 'Dr. Ghulam Rasool',
            wardenPhone: '+92 301 2345678',
            amenities: ['High-Speed Wi-Fi', '24/7 Power Backup', 'Mess Hall & Dining', 'Library & Study Hall', 'Geyser Facilities'],
            images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
            ],
        },
        {
            name: 'Marvi Girls Hostel Complex',
            gender: 'Female',
            totalCapacity: 200,
            address: 'Sector C, Girls Hostel Enclave, Jamshoro',
            description: 'Secure and comfortable residential hall for female students featuring round-the-clock female wardens, indoor sports, and lush green gardens.',
            eligibilityRequirement: 'Open to all female students of University of Sindh with CPN above 65.',
            warden: 'Prof. Dr. Tahira Parveen',
            wardenPhone: '+92 302 3456789',
            amenities: ['High-Speed Wi-Fi', '24/7 Female Security', 'Indoor Sports Complex', 'Mess Hall', 'Computer Lab'],
            images: [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
            ],
        },
    ];
    for (const hData of hostelsData) {
        let hostel = await hostelRepo.findOne({ where: { name: hData.name } });
        if (!hostel) {
            hostel = hostelRepo.create({
                name: hData.name,
                gender: hData.gender,
                totalCapacity: hData.totalCapacity,
                address: hData.address,
                description: hData.description,
                eligibilityRequirement: hData.eligibilityRequirement,
                warden: hData.warden,
                wardenPhone: hData.wardenPhone,
                isActive: true,
            });
            await hostelRepo.save(hostel);
            for (const am of hData.amenities) {
                const amenity = amenityRepo.create({ hostelId: hostel.hostelId, amenityName: am });
                await amenityRepo.save(amenity);
            }
            for (let idx = 0; idx < hData.images.length; idx++) {
                const img = imageRepo.create({
                    hostelId: hostel.hostelId,
                    imageUrl: hData.images[idx],
                    isPrimary: idx === 0,
                });
                await imageRepo.save(img);
            }
        }
    }
    console.log('✅ Hostels Seeded');
    // 6. Seed Announcements
    const existingAnn = await announcementRepo.findOne({ where: {} });
    if (!existingAnn && adminUser) {
        const adminRec = await adminRepo.findOne({ where: { userId: adminUser.userId } });
        if (adminRec) {
            const ann = announcementRepo.create({
                adminId: adminRec.adminId,
                title: 'Hostel Accommodation Applications Open for Session 2025-2026',
                content: 'All eligible students of University of Sindh, Jamshoro are notified that online applications for hostel allotment are now open. Please complete your registration and profile verification before submitting your preferences.',
                isPublished: true,
                publishedAt: new Date(),
                targetAudience: 'All',
            });
            await announcementRepo.save(ann);
            console.log('✅ Announcements Seeded');
        }
    }
    console.log('🎉 Seeding Complete!');
};
exports.seedDatabase = seedDatabase;
if (require.main === module) {
    database_1.AppDataSource.initialize()
        .then(async () => {
        await (0, exports.seedDatabase)();
        process.exit(0);
    })
        .catch((err) => {
        console.error('Error seeding database:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=seed.js.map