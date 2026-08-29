import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Admin } from '../entities/Admin';
import { Student } from '../entities/Student';
import { StudentProfile } from '../entities/StudentProfile';
import { UniversityStudentRecord } from '../entities/UniversityStudentRecord';
import { SimulatedUniversityRecord } from '../entities/SimulatedUniversityRecord';
import { District } from '../entities/District';
import { Department } from '../entities/Department';
import { Program } from '../entities/Program';
import { Hostel } from '../entities/Hostel';
import { HostelAmenity } from '../entities/HostelAmenity';
import { HostelImage } from '../entities/HostelImage';
import { Block } from '../entities/Block';
import { Floor } from '../entities/Floor';
import { Room } from '../entities/Room';
import { Bed } from '../entities/Bed';
import { AcademicYear } from '../entities/AcademicYear';
import { Application } from '../entities/Application';
import { ApplicationHostelPreference } from '../entities/ApplicationHostelPreference';
import { Allocation } from '../entities/Allocation';
import { Resident } from '../entities/Resident';
import { AdminSettings } from '../entities/AdminSettings';
import { Announcement } from '../entities/Announcement';

export const seedDatabase = async (): Promise<void> => {
  console.log('🌱 Starting Comprehensive Database Seeding...');

  const userRepo = AppDataSource.getRepository(User);
  const adminRepo = AppDataSource.getRepository(Admin);
  const simRepo = AppDataSource.getRepository(SimulatedUniversityRecord);
  const studentRepo = AppDataSource.getRepository(Student);
  const profileRepo = AppDataSource.getRepository(StudentProfile);
  const univRecordRepo = AppDataSource.getRepository(UniversityStudentRecord);
  const districtRepo = AppDataSource.getRepository(District);
  const deptRepo = AppDataSource.getRepository(Department);
  const progRepo = AppDataSource.getRepository(Program);
  const hostelRepo = AppDataSource.getRepository(Hostel);
  const amenityRepo = AppDataSource.getRepository(HostelAmenity);
  const imageRepo = AppDataSource.getRepository(HostelImage);
  const blockRepo = AppDataSource.getRepository(Block);
  const floorRepo = AppDataSource.getRepository(Floor);
  const roomRepo = AppDataSource.getRepository(Room);
  const bedRepo = AppDataSource.getRepository(Bed);
  const academicYearRepo = AppDataSource.getRepository(AcademicYear);
  const applicationRepo = AppDataSource.getRepository(Application);
  const preferenceRepo = AppDataSource.getRepository(ApplicationHostelPreference);
  const allocationRepo = AppDataSource.getRepository(Allocation);
  const residentRepo = AppDataSource.getRepository(Resident);
  const settingsRepo = AppDataSource.getRepository(AdminSettings);
  const announcementRepo = AppDataSource.getRepository(Announcement);

  // 1. Seed Academic Year
  let academicYear = await academicYearRepo.findOne({ where: { label: '2025-2026' } });
  if (!academicYear) {
    academicYear = academicYearRepo.create({
      label: '2025-2026',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true,
    });
    await academicYearRepo.save(academicYear);
  }
  console.log('✅ Academic Year Seeded (2025-2026)');

  // 2. Seed Admin User
  const adminEmail = 'admin@usindh.edu.pk';
  let adminUser = await userRepo.findOne({ where: { email: adminEmail } });
  if (!adminUser) {
    const adminPassHash = await bcrypt.hash('AdminPassword123!', 10);
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
  }
  console.log('✅ Admin Account Seeded (Email: admin@usindh.edu.pk | Pass: AdminPassword123!)');

  // 3. Seed AdminSettings
  try {
    await AppDataSource.query("ALTER TABLE AdminSettings ADD COLUMN SindhProvinceFee DECIMAL(10,2) NOT NULL DEFAULT 25000.00");
    await AppDataSource.query("ALTER TABLE AdminSettings ADD COLUMN OtherProvincesFee DECIMAL(10,2) NOT NULL DEFAULT 35000.00");
    await AppDataSource.query("ALTER TABLE AdminSettings ADD COLUMN InternationalStudentsFee DECIMAL(10,2) NOT NULL DEFAULT 75000.00");
    await AppDataSource.query("ALTER TABLE AdminSettings ADD COLUMN ProcessingFee DECIMAL(10,2) NOT NULL DEFAULT 100.00");
  } catch (_colErr) {
    // Columns already exist
  }

  try {
    let settings = await settingsRepo.findOne({ where: {} });
    if (!settings) {
      settings = settingsRepo.create({
        allocationOpen: true,
        allocationEnabled: true,
        allocationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        effectiveFrom: new Date(),
      });
      await settingsRepo.save(settings);
    }
    console.log('✅ AdminSettings Seeded');
  } catch (err: any) {
    console.log('✅ AdminSettings Ready');
  }

  // 4. Seed Districts
  try {
    await AppDataSource.query("ALTER TABLE Districts ADD COLUMN IsAllowed TINYINT(1) NOT NULL DEFAULT 1");
  } catch (_colErr) {
    // Column already exists
  }

  const districtList = [
    'Badin', 'Dadu', 'Ghotki', 'Hyderabad', 'Jacobabad', 'Jamshoro',
    'Karachi Central', 'Karachi East', 'Karachi South', 'Karachi West', 'Keamari', 'Korangi', 'Malir',
    'Kashmore', 'Khairpur', 'Larkana', 'Matiari', 'Mirpurkhas', 'Naushahro Feroze',
    'Qambar Shahdadkot', 'Sanghar', 'Shaheed Benazirabad', 'Shikarpur', 'Sujawal',
    'Sukkur', 'Tando Allahyar', 'Tando Muhammad Khan', 'Tharparkar', 'Thatta', 'Umerkot'
  ];
  const districtMap = new Map<string, District>();
  for (const name of districtList) {
    let dist = await districtRepo.findOne({ where: { name } });
    if (!dist) {
      dist = districtRepo.create({ name, province: 'Sindh', isAllowed: true });
      await districtRepo.save(dist);
    }
    districtMap.set(name, dist);
  }

  // 5. Seed Departments & Programs
  const deptProgData = [
    { deptName: 'Computer Science', deptCode: 'CS', progName: 'BS Computer Science', progCode: 'BSCS' },
    { deptName: 'Software Engineering', deptCode: 'SE', progName: 'BS Software Engineering', progCode: 'BSSE' },
    { deptName: 'Information Technology', deptCode: 'IT', progName: 'BS Information Technology', progCode: 'BSIT' },
    { deptName: 'Business Administration', deptCode: 'BBA', progName: 'BBA', progCode: 'BBA' },
    { deptName: 'English Literature', deptCode: 'ENG', progName: 'BS English', progCode: 'BSENG' },
  ];

  const deptMap = new Map<string, Department>();
  const progMap = new Map<string, Program>();

  for (const item of deptProgData) {
    let dept = await deptRepo.findOne({ where: { name: item.deptName } });
    if (!dept) {
      dept = deptRepo.create({ name: item.deptName, code: item.deptCode });
      await deptRepo.save(dept);
    }
    deptMap.set(item.deptName, dept);

    let prog = await progRepo.findOne({ where: { name: item.progName } });
    if (!prog) {
      prog = progRepo.create({
        name: item.progName,
        code: item.progCode,
        departmentId: dept.departmentId,
        degreeType: 'BS',
      });
      await progRepo.save(prog);
    }
    progMap.set(item.progName, prog);
  }

  // 6. Seed Full Comprehensive List of Hostels (Matching Frontend Mock Data)
  const hostelsData = [
    {
      name: 'Marvi Girls Hostel',
      gender: 'Female',
      totalCapacity: 683,
      address: 'Girls Hostel Complex, Main Campus, Jamshoro',
      description: 'The premier girls hostel offering top-notch security, beautiful central garden, and nutritious hygienic food options.',
      eligibilityRequirement: 'Must be enrolled female student of University of Sindh with CPN above 65.',
      warden: 'Prof. Dr. Shaheen Shah',
      wardenPhone: '+92 300 9876543',
      amenities: ['High-Speed WiFi', '24/7 Female Security', 'In-House Mess', 'Lush Green Lawn', 'Reading Room'],
      images: [
        '/images/marvi-hostel.jpeg',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Lal Shahbaz Hostel',
      gender: 'Male',
      totalCapacity: 412,
      address: 'Main Campus, Jamshoro',
      description: 'Named after the revered Sufi saint, this hostel combines traditional architecture with active student sports culture and spacious rooms.',
      eligibilityRequirement: 'Open to all male undergraduate students.',
      warden: 'Engr. Mansoor Ali Soomro',
      wardenPhone: '+92 312 4567890',
      amenities: ['High-Speed WiFi', 'Reading Hall', 'Cafeteria', 'Sports Ground', 'Guarded Gate'],
      images: [
        '/images/lal-shahbaz-hostel.jpeg',
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'P.G Girl Hostel',
      gender: 'Female',
      totalCapacity: 204,
      address: 'Main Campus, Jamshoro',
      description: 'The largest capacity hostel on campus, known for its bustling student community, budget-friendly mess facility, and open courtyard.',
      eligibilityRequirement: 'Open to female postgraduate and master scholars.',
      warden: 'Prof. Fiza',
      wardenPhone: '+92 333 9876542',
      amenities: ['24/7 Security & CCTV', 'Subsidized Mess', 'Laundry Area', 'Indoor Games', 'Generator'],
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Under Graduate Girls Hostel',
      gender: 'Female',
      totalCapacity: 451,
      address: 'Main Campus, Jamshoro',
      description: 'A cozy, lower-density residential block providing a quiet and focused environment ideal for Under Graduate female scholars.',
      eligibilityRequirement: 'Must be enrolled in 1st to 8th Semester BS Program.',
      warden: 'Dr. Ghulam Mustafa Shah',
      wardenPhone: '+92 300 1122334',
      amenities: ['WiFi', 'Quiet Study Area', 'Filtered Water', 'Security Guard', 'Common Room'],
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Allama Iqbal Hostel',
      gender: 'Male',
      totalCapacity: 420,
      address: 'Main Campus, Jamshoro',
      description: 'A vibrant boys hostel offering a balanced academic atmosphere, large common areas, and quick access to central campus departments.',
      eligibilityRequirement: 'Open to all male university students.',
      warden: 'Dr. Farooq Ahmed Memon',
      wardenPhone: '+92 301 2345671',
      amenities: ['WiFi', 'Mess & Dining', '24/7 Security', 'Study Room', 'Water Plant'],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Sindh University Teachers Hostel',
      gender: 'Male',
      totalCapacity: 75,
      address: 'Main Campus, Jamshoro',
      description: 'Reserved for eligible university teachers and research fellows, offering well-maintained gardens and peace of mind.',
      eligibilityRequirement: 'Teachers, Research Fellows, and PhD scholars.',
      warden: 'Mr. Abdul Rasheed Kalhoro',
      wardenPhone: '+92 305 6677889',
      amenities: ['WiFi', 'Dedicated Dining Hall', '24/7 Power Backup', 'Parking Space', 'Gardens'],
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Sindh University Employees Hostel',
      gender: 'Male',
      totalCapacity: 75,
      address: 'Main Campus, Jamshoro',
      description: 'Reserved for eligible university staff sons and research fellows, offering well-maintained gardens and peace of mind.',
      eligibilityRequirement: 'University staff dependents and fellows.',
      warden: 'Mr. Abdul Rasheed Kalhoro',
      wardenPhone: '+92 305 6677889',
      amenities: ['WiFi', 'Dedicated Dining Hall', '24/7 Power Backup', 'Parking Space', 'Gardens'],
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Blocks Hostel',
      gender: 'Male',
      totalCapacity: 180,
      address: 'Main Campus, Jamshoro',
      description: 'Compact residential block featuring an active badminton court and easy access to the central university library.',
      eligibilityRequirement: 'Open to undergraduate male students.',
      warden: 'Mr. Imtiaz Ahmed Khoso',
      wardenPhone: '+92 334 5544332',
      amenities: ['Mess Facility', 'RO Water Plant', 'Study Room', 'Night Security', 'Badminton Court'],
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Shaheed Benazir Bhutto International Hostel',
      gender: 'Male',
      totalCapacity: 338,
      address: 'Main Campus, Jamshoro',
      description: 'Specially designed to accommodate international exchange students and scholars with premium amenities and climate control.',
      eligibilityRequirement: 'International exchange scholars and postgraduate researchers.',
      warden: 'Prof. Dr. Zahid Hussain Nizamani',
      wardenPhone: '+92 313 7766554',
      amenities: ['Air Conditioned Rooms', 'International Mess', '24/7 Security & Access Control', 'High-Speed WiFi', 'Laundry Service'],
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Government Federal Hostel',
      gender: 'Male',
      totalCapacity: 570,
      address: 'Main Campus, Jamshoro',
      description: 'Focuses on creating a disciplined yet supportive home-like environment for undergraduate scholars.',
      eligibilityRequirement: 'Open to undergraduate scholars from all provinces.',
      warden: 'Dr. Sultan',
      wardenPhone: '+92 303 5566778',
      amenities: ['WiFi', 'Study Lounge', 'Clean Dining', '24/7 Security Gate', 'Medical First Aid'],
      images: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Shaheed Zulfiqar Ali Bhutto Hostel',
      gender: 'Male',
      totalCapacity: 200,
      address: 'Main Campus, Jamshoro',
      description: 'Known for its friendly courtyard gathering space, delicious weekend mess menus, and quiet study quarters.',
      eligibilityRequirement: 'Enrolled undergraduate male students.',
      warden: 'Mrs. Farz Memon',
      wardenPhone: '+92 315 8899001',
      amenities: ['High-Speed WiFi', 'Nutritious Mess Menu', 'Computer Room', 'Courtyard Garden', '24/7 Guarded Gate'],
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Khan Bahadur Syed Allahando Shah Hostel',
      gender: 'Male',
      totalCapacity: 320,
      address: 'Main Campus, Jamshoro',
      description: 'Features a dedicated quiet study library open 24 hours during exam seasons and reliable solar power backup.',
      eligibilityRequirement: 'Open to 2nd to 4th year BS male students.',
      warden: 'Dr. Awais Unar',
      wardenPhone: '+92 307 1122445',
      amenities: ['WiFi', 'Silent Study Library', 'Solar Power Generator', 'Purified Water Plant', 'Guarding Staff'],
      images: [
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      name: 'Makhdoom Ameen Fahmeen Hostel',
      gender: 'Male',
      totalCapacity: 184,
      address: 'Main Campus, Jamshoro',
      description: 'Conveniently located near the central departmental block with an in-house tuck shop and comprehensive healthcare support.',
      eligibilityRequirement: 'Open to registered undergraduate students.',
      warden: 'Prof. Dr. Farz Baloch',
      wardenPhone: '+92 336 9900112',
      amenities: ['WiFi', 'Central Mess', 'Tuck Shop', 'Medical Room', '24/7 Security Gate'],
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      ],
    },
  ];

  const hostelMap = new Map<string, Hostel>();
  const firstBedMap = new Map<number, Bed>();

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
    } else {
      hostel.gender = hData.gender;
      hostel.totalCapacity = hData.totalCapacity;
      hostel.address = hData.address;
      hostel.description = hData.description;
      hostel.eligibilityRequirement = hData.eligibilityRequirement;
      hostel.warden = hData.warden;
      hostel.wardenPhone = hData.wardenPhone;
      hostel.isActive = true;
    }
    await hostelRepo.save(hostel);

    // Refresh Amenities
    await amenityRepo.delete({ hostelId: hostel.hostelId });
    for (const am of hData.amenities) {
      const amenity = amenityRepo.create({ hostelId: hostel.hostelId, amenityName: am });
      await amenityRepo.save(amenity);
    }

    // Refresh Images
    await imageRepo.delete({ hostelId: hostel.hostelId });
    for (let idx = 0; idx < hData.images.length; idx++) {
      const img = imageRepo.create({
        hostelId: hostel.hostelId,
        imageUrl: hData.images[idx],
        isPrimary: idx === 0,
      });
      await imageRepo.save(img);
    }
    hostelMap.set(hData.name, hostel);

    // Create Block, Floor, Room, and Beds if none exist for allocation target
    let block = await blockRepo.findOne({ where: { hostelId: hostel.hostelId, blockName: 'Block A' } });
    if (!block) {
      block = blockRepo.create({ hostelId: hostel.hostelId, blockName: 'Block A' });
      await blockRepo.save(block);
    }

    let floor = await floorRepo.findOne({ where: { blockId: block.blockId, floorNumber: 1 } });
    if (!floor) {
      floor = floorRepo.create({ blockId: block.blockId, floorNumber: 1 });
      await floorRepo.save(floor);
    }

    let room = await roomRepo.findOne({ where: { floorId: floor.floorId, roomNumber: '101' } });
    if (!room) {
      room = roomRepo.create({ floorId: floor.floorId, roomNumber: '101', roomType: 'Double', isActive: true });
      await roomRepo.save(room);
    }

    let bed = await bedRepo.findOne({ where: { roomId: room.roomId, bedLabel: 'Bed-1' } });
    if (!bed) {
      bed = bedRepo.create({ roomId: room.roomId, bedLabel: 'Bed-1', isActive: true });
      await bedRepo.save(bed);
    }
    firstBedMap.set(hostel.hostelId, bed);
  }
  console.log(`✅ Hostels & Room Structures Seeded (${hostelsData.length} Total Hostels)`);

  // 7. Seed Simulated University Records for 7 Demo Accounts
  const demoRecords = [
    // --- 3 Residents (Allocated) ---
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
      cgpa: 3.40,
      cpn: 79.0,
      semester: 4,
      gender: 'Male',
      dateOfBirth: '2003-01-10',
    },
    // --- 2 New Students (Allocation Pending) ---
    {
      cnic: '4130412345674',
      rollNumber: '2K22/CSM/15',
      fullName: 'Tariq Mehmood',
      fatherName: 'Mehmood Ali',
      address: 'Bhan Syedabad, Dadu',
      districtName: 'Dadu',
      departmentName: 'Computer Science',
      programName: 'BS Computer Science',
      cgpa: 3.20,
      cpn: 75.0,
      semester: 4,
      gender: 'Male',
      dateOfBirth: '2003-04-12',
    },
    {
      cnic: '4130412345675',
      rollNumber: '2K22/CSM/18',
      fullName: 'Dua Fatima',
      fatherName: 'Rashid Fatima',
      address: 'Satellite Town, Mirpurkhas',
      districtName: 'Mirpurkhas',
      departmentName: 'Software Engineering',
      programName: 'BS Software Engineering',
      cgpa: 3.60,
      cpn: 81.0,
      semester: 4,
      gender: 'Female',
      dateOfBirth: '2003-11-25',
    },
    // --- 2 Non-Registered / Applicants (Not Registered Yet - Ready for registration demo) ---
    {
      cnic: '4130412345676',
      rollNumber: '2K23/CSM/40',
      fullName: 'Bilal Hassan',
      fatherName: 'Hassan Raza',
      address: 'Station Road, Sukkur',
      districtName: 'Sukkur',
      departmentName: 'Business Administration',
      programName: 'BBA',
      cgpa: 3.10,
      cpn: 72.5,
      semester: 2,
      gender: 'Male',
      dateOfBirth: '2004-02-18',
    },
    {
      cnic: '4130412345677',
      rollNumber: '2K23/CSM/42',
      fullName: 'Ayesha Baloch',
      fatherName: 'Nawab Baloch',
      address: 'Resham Gali, Larkana',
      districtName: 'Larkana',
      departmentName: 'English Literature',
      programName: 'BS English',
      cgpa: 3.55,
      cpn: 78.0,
      semester: 2,
      gender: 'Female',
      dateOfBirth: '2004-07-09',
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
        profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.fullName.replace(/\s+/g, '')}`,
        isActive: true,
      });
      await simRepo.save(sim);
    }
  }
  console.log('✅ Simulated University Records Seeded (7 Demo Profiles)');

  // 8. Seed Registered Student Accounts (5 Accounts: 3 Residents + 2 Pending)
  const registeredAccounts = [
    // 3 Residents
    {
      email: 'student@usindh.edu.pk',
      cnic: '4130412345671',
      roll: '2K21/CSM/01',
      firstName: 'Ali',
      lastName: 'Ahmed',
      gender: 'Male',
      dob: '2002-05-15',
      districtName: 'Hyderabad',
      deptName: 'Computer Science',
      progName: 'BS Computer Science',
      cgpa: 3.75,
      semester: 6,
      hostelName: 'Lal Shahbaz Hostel',
      status: 'Allocated',
    },
    {
      email: 'sara.khan@usindh.edu.pk',
      cnic: '4130412345672',
      roll: '2K21/CSM/02',
      firstName: 'Sara',
      lastName: 'Khan',
      gender: 'Female',
      dob: '2002-08-20',
      districtName: 'Hyderabad',
      deptName: 'Software Engineering',
      progName: 'BS Software Engineering',
      cgpa: 3.85,
      semester: 6,
      hostelName: 'Marvi Girls Hostel',
      status: 'Allocated',
    },
    {
      email: 'zubair.shah@usindh.edu.pk',
      cnic: '4130412345673',
      roll: '2K21/CSM/03',
      firstName: 'Zubair',
      lastName: 'Shah',
      gender: 'Male',
      dob: '2003-01-10',
      districtName: 'Jamshoro',
      deptName: 'Information Technology',
      progName: 'BS Information Technology',
      cgpa: 3.40,
      semester: 4,
      hostelName: 'Shaheed Benazir Bhutto International Hostel',
      status: 'Allocated',
    },
    // 2 New Students (Allocation Pending)
    {
      email: 'tariq.mehmood@usindh.edu.pk',
      cnic: '4130412345674',
      roll: '2K22/CSM/15',
      firstName: 'Tariq',
      lastName: 'Mehmood',
      gender: 'Male',
      dob: '2003-04-12',
      districtName: 'Dadu',
      deptName: 'Computer Science',
      progName: 'BS Computer Science',
      cgpa: 3.20,
      semester: 4,
      hostelName: 'Lal Shahbaz Hostel',
      status: 'Submitted',
    },
    {
      email: 'dua.fatima@usindh.edu.pk',
      cnic: '4130412345675',
      roll: '2K22/CSM/18',
      firstName: 'Dua',
      lastName: 'Fatima',
      gender: 'Female',
      dob: '2003-11-25',
      districtName: 'Mirpurkhas',
      deptName: 'Software Engineering',
      progName: 'BS Software Engineering',
      cgpa: 3.60,
      semester: 4,
      hostelName: 'Marvi Girls Hostel',
      status: 'Submitted',
    },
  ];

  for (const acc of registeredAccounts) {
    let user = await userRepo.findOne({ where: { email: acc.email } });
    if (!user) {
      const studentPassHash = await bcrypt.hash('StudentPassword123!', 10);
      user = userRepo.create({
        email: acc.email,
        passwordHash: studentPassHash,
        firstName: acc.firstName,
        lastName: acc.lastName,
        role: 'Student',
        isActive: true,
        phoneNumber: '+92 300 1234567',
      });
      await userRepo.save(user);

      const district = districtMap.get(acc.districtName) || (await districtRepo.findOne({ where: { name: acc.districtName } }));
      const dept = deptMap.get(acc.deptName) || (await deptRepo.findOne({ where: { name: acc.deptName } }));
      const prog = progMap.get(acc.progName) || (await progRepo.findOne({ where: { name: acc.progName } }));

      const student = studentRepo.create({
        userId: user.userId,
        cnic: acc.cnic,
        registrationNumber: acc.roll,
        gender: acc.gender,
        dateOfBirth: acc.dob,
        districtId: district?.districtId || null,
      });
      await studentRepo.save(student);

      const profile = profileRepo.create({
        studentId: student.studentId,
        homeAddress: `${acc.districtName}, Sindh`,
        city: acc.districtName,
        guardianName: `${acc.lastName} Father`,
        guardianPhone: '+92 300 7654321',
        guardianRelation: 'Father',
        bloodGroup: 'O+',
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.firstName}${acc.lastName}`,
      });
      await profileRepo.save(profile);

      const record = univRecordRepo.create({
        studentId: student.studentId,
        departmentId: dept?.departmentId || null,
        programId: prog?.programId || null,
        semester: acc.semester,
        cgpa: acc.cgpa,
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: 'SYSTEM_INITIALIZER',
      });
      await univRecordRepo.save(record);

      // Create Application
      let app = await applicationRepo.findOne({ where: { studentId: student.studentId } });
      if (!app) {
        app = applicationRepo.create({
          studentId: student.studentId,
          academicYearId: academicYear.academicYearId,
          status: acc.status,
          submittedAt: new Date(),
        });
        await applicationRepo.save(app);

        const targetHostel = hostelMap.get(acc.hostelName);
        if (targetHostel) {
          const pref = preferenceRepo.create({
            applicationId: app.applicationId,
            hostelId: targetHostel.hostelId,
            preferenceOrder: 1,
          });
          await preferenceRepo.save(pref);

          // If Status is 'Allocated', create Allocation & Resident records
          if (acc.status === 'Allocated') {
            const bed = firstBedMap.get(targetHostel.hostelId);
            if (bed) {
              let alloc = await allocationRepo.findOne({ where: { studentId: student.studentId } });
              if (!alloc) {
                alloc = allocationRepo.create({
                  applicationId: app.applicationId,
                  studentId: student.studentId,
                  bedId: bed.bedId,
                  allocatedAt: new Date(),
                  isActive: true,
                });
                await allocationRepo.save(alloc);

                let resRec = await residentRepo.findOne({ where: { allocationId: alloc.allocationId } });
                if (!resRec) {
                  resRec = residentRepo.create({
                    allocationId: alloc.allocationId,
                    checkInDate: '2025-09-01',
                    isCurrentResident: true,
                  });
                  await residentRepo.save(resRec);
                }
              }
            }
          }
        }
      }
    }
  }

  console.log('✅ 5 Registered Student Accounts Seeded (3 Residents + 2 Pending)');

  // 9. Seed Announcements
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
    }
  }
  console.log('✅ Announcements Seeded');

  console.log('🎉 Seeding Complete!');
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error seeding database:', err);
      process.exit(1);
    });
}
