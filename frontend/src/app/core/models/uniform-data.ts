// src/app/core/models/uniform-data.ts

export interface UniformStudent {
  id: number;
  studentId: number;
  cnic: string;
  rollNumber: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  department: string;
  deptCode: string;
  program: string;
  district: string;
  province: string;
  academicYear: string;
  semester: number;
  cgpa: number;
  cpn: number;
  campus: string;
  status: 'Allocated' | 'In Processing' | 'Submitted' | 'Ineligible' | 'Not Processed';
  // Residency Details (if allocated)
  isResident: boolean;
  hostelId?: number;
  hostelName?: string;
  block?: string;
  room?: string;
  bed?: string;
  annualFeeStatus?: 'Paid' | 'Pending' | 'Unpaid';
  annualFeeAmount?: number;
  meritScore?: number;
  rank?: number;
}

// Single Source of Truth for Uniform Student & Resident Dataset (60 Records)
export const UNIFORM_STUDENTS: UniformStudent[] = [
  // ── Primary Demo Accounts (1 to 7) ──
  {
    id: 1, studentId: 1, cnic: '41304-1234567-1', rollNumber: '2K21/CSM/01',
    name: 'Ali Ahmed', firstName: 'Ali', lastName: 'Ahmed', gender: 'Male',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Hyderabad', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.75, cpn: 84.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 2, hostelName: 'Lal Shahbaz Hostel', block: 'Block A', room: '101', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 92.5, rank: 1
  },
  {
    id: 2, studentId: 2, cnic: '41304-1234567-2', rollNumber: '2K21/CSM/02',
    name: 'Sara Khan', firstName: 'Sara', lastName: 'Khan', gender: 'Female',
    department: 'Software Engineering', deptCode: 'SWE', program: 'BS Software Engineering',
    district: 'Hyderabad', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.85, cpn: 88.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 1, hostelName: 'Marvi Girls Hostel', block: 'Block A', room: '101', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 95.8, rank: 2
  },
  {
    id: 3, studentId: 3, cnic: '41304-1234567-3', rollNumber: '2K21/CSM/03',
    name: 'Zubair Shah', firstName: 'Zubair', lastName: 'Shah', gender: 'Male',
    department: 'Information Technology', deptCode: 'IT', program: 'BS Information Technology',
    district: 'Jamshoro', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.40, cpn: 79.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 9, hostelName: 'Shaheed Benazir Bhutto International Hostel', block: 'Block A', room: '101', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 32000, meritScore: 88.0, rank: 3
  },
  {
    id: 4, studentId: 4, cnic: '41304-1234567-4', rollNumber: '2K22/CSM/15',
    name: 'Tariq Mehmood', firstName: 'Tariq', lastName: 'Mehmood', gender: 'Male',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Dadu', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.20, cpn: 75.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 81.5, rank: 4
  },
  {
    id: 5, studentId: 5, cnic: '41304-1234567-5', rollNumber: '2K22/CSM/18',
    name: 'Dua Fatima', firstName: 'Dua', lastName: 'Fatima', gender: 'Female',
    department: 'Software Engineering', deptCode: 'SWE', program: 'BS Software Engineering',
    district: 'Mirpurkhas', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.60, cpn: 81.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 87.2, rank: 5
  },
  {
    id: 6, studentId: 6, cnic: '41304-1234567-6', rollNumber: '2K23/CSM/40',
    name: 'Bilal Hassan', firstName: 'Bilal', lastName: 'Hassan', gender: 'Male',
    department: 'Business Administration', deptCode: 'BBA', program: 'BBA',
    district: 'Sukkur', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.10, cpn: 72.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 78.4, rank: 6
  },
  {
    id: 7, studentId: 7, cnic: '41304-1234567-7', rollNumber: '2K23/CSM/42',
    name: 'Ayesha Baloch', firstName: 'Ayesha', lastName: 'Baloch', gender: 'Female',
    department: 'English Literature', deptCode: 'ENG', program: 'BS English',
    district: 'Larkana', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.55, cpn: 78.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 84.0, rank: 7
  },

  // ── Allocated Residents (8 to 35) ──
  {
    id: 8, studentId: 8, cnic: '41304-1234567-8', rollNumber: '2K21/CSM/08',
    name: 'Usman Raza', firstName: 'Usman', lastName: 'Raza', gender: 'Male',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Sukkur', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.65, cpn: 83.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 2, hostelName: 'Lal Shahbaz Hostel', block: 'Block A', room: '102', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 91.0, rank: 8
  },
  {
    id: 9, studentId: 9, cnic: '41304-1234567-9', rollNumber: '2K21/SWE/09',
    name: 'Fatima Sheikh', firstName: 'Fatima', lastName: 'Sheikh', gender: 'Female',
    department: 'Software Engineering', deptCode: 'SWE', program: 'BS Software Engineering',
    district: 'Larkana', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.78, cpn: 86.4,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 1, hostelName: 'Marvi Girls Hostel', block: 'Block A', room: '102', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 94.2, rank: 9
  },
  {
    id: 10, studentId: 10, cnic: '41304-1234567-10', rollNumber: '2K21/IT/10',
    name: 'Hamza Soomro', firstName: 'Hamza', lastName: 'Soomro', gender: 'Male',
    department: 'Information Technology', deptCode: 'IT', program: 'BS Information Technology',
    district: 'Badin', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.50, cpn: 80.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 5, hostelName: 'Allama Iqbal Hostel', block: 'Block A', room: '103', bed: 'Bed-1',
    annualFeeStatus: 'Pending', annualFeeAmount: 25000, meritScore: 89.5, rank: 10
  },
  {
    id: 11, studentId: 11, cnic: '41304-1234567-11', rollNumber: '2K21/BBA/11',
    name: 'Zainab Junejo', firstName: 'Zainab', lastName: 'Junejo', gender: 'Female',
    department: 'Business Administration', deptCode: 'BBA', program: 'BBA',
    district: 'Thatta', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.70, cpn: 85.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 4, hostelName: 'Under Graduate Girls Hostel', block: 'Block A', room: '103', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 93.0, rank: 11
  },
  {
    id: 12, studentId: 12, cnic: '41304-1234567-12', rollNumber: '2K21/EE/12',
    name: 'Fahad Talpur', firstName: 'Fahad', lastName: 'Talpur', gender: 'Male',
    department: 'Electrical Engineering', deptCode: 'EE', program: 'BS Electrical Engineering',
    district: 'Naushahro Feroze', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.42, cpn: 79.8,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 8, hostelName: 'Blocks Hostel', block: 'Block A', room: '104', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 87.5, rank: 12
  },
  {
    id: 13, studentId: 13, cnic: '41304-1234567-13', rollNumber: '2K21/CE/13',
    name: 'Asad Kalhoro', firstName: 'Asad', lastName: 'Kalhoro', gender: 'Male',
    department: 'Civil Engineering', deptCode: 'CE', program: 'BS Civil Engineering',
    district: 'Khairpur', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.38, cpn: 78.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 10, hostelName: 'Government Federal Hostel', block: 'Block A', room: '105', bed: 'Bed-1',
    annualFeeStatus: 'Unpaid', annualFeeAmount: 25000, meritScore: 86.0, rank: 13
  },
  {
    id: 14, studentId: 14, cnic: '41304-1234567-14', rollNumber: '2K21/ENG/14',
    name: 'Mariam Syed', firstName: 'Mariam', lastName: 'Syed', gender: 'Female',
    department: 'English Literature', deptCode: 'ENG', program: 'BS English',
    district: 'Sanghar', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.68, cpn: 84.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 1, hostelName: 'Marvi Girls Hostel', block: 'Block B', room: '104', bed: 'Bed-2',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 92.0, rank: 14
  },
  {
    id: 15, studentId: 15, cnic: '41304-1234567-15', rollNumber: '2K21/PHY/15',
    name: 'Shahzaib Mangi', firstName: 'Shahzaib', lastName: 'Mangi', gender: 'Male',
    department: 'Physics', deptCode: 'PHY', program: 'BS Physics',
    district: 'Shikarpur', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.55, cpn: 81.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 11, hostelName: 'Shaheed Zulfiqar Ali Bhutto Hostel', block: 'Block A', room: '106', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 89.0, rank: 15
  },
  {
    id: 16, studentId: 16, cnic: '41304-1234567-16', rollNumber: '2K21/CHEM/16',
    name: 'Sana Solangi', firstName: 'Sana', lastName: 'Solangi', gender: 'Female',
    department: 'Chemistry', deptCode: 'CHEM', program: 'BS Chemistry',
    district: 'Jacobabad', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.62, cpn: 83.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 4, hostelName: 'Under Graduate Girls Hostel', block: 'Block B', room: '105', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 91.5, rank: 16
  },
  {
    id: 17, studentId: 17, cnic: '41304-1234567-17', rollNumber: '2K21/LAW/17',
    name: 'Noman Abro', firstName: 'Noman', lastName: 'Abro', gender: 'Male',
    department: 'Law', deptCode: 'LAW', program: 'LL.B',
    district: 'Ghotki', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.45, cpn: 80.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 12, hostelName: 'Khan Bahadur Syed Allahndo Shah Hostel', block: 'Block A', room: '107', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 88.5, rank: 17
  },
  {
    id: 18, studentId: 18, cnic: '41304-1234567-18', rollNumber: '2K21/PHARM/18',
    name: 'Hira Mahar', firstName: 'Hira', lastName: 'Mahar', gender: 'Female',
    department: 'Pharmacy', deptCode: 'PHARM', program: 'Pharm.D',
    district: 'Kashmore', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.82, cpn: 87.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 3, hostelName: 'Post Graduate (P.G) Girls Hostel', block: 'Block A', room: '108', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 32000, meritScore: 95.0, rank: 18
  },
  {
    id: 19, studentId: 19, cnic: '41304-1234567-19', rollNumber: '2K21/ECO/19',
    name: 'Rashid Chandio', firstName: 'Rashid', lastName: 'Chandio', gender: 'Male',
    department: 'Economics', deptCode: 'ECO', program: 'BS Economics',
    district: 'Umerkot', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.35, cpn: 78.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 13, hostelName: 'Makhdoom Ameen Fahmeen Hostel', block: 'Block A', room: '109', bed: 'Bed-1',
    annualFeeStatus: 'Pending', annualFeeAmount: 25000, meritScore: 85.5, rank: 19
  },
  {
    id: 20, studentId: 20, cnic: '41304-1234567-20', rollNumber: '2K21/CSM/20',
    name: 'Laiba Memon', firstName: 'Laiba', lastName: 'Memon', gender: 'Female',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Tando Allahyar', province: 'Sindh', academicYear: '2025-2026', semester: 6, cgpa: 3.72, cpn: 85.8,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 1, hostelName: 'Marvi Girls Hostel', block: 'Block C', room: '201', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 93.8, rank: 20
  },
  {
    id: 21, studentId: 21, cnic: '41304-1234567-21', rollNumber: '2K22/CSM/21',
    name: 'Waqas Khoso', firstName: 'Waqas', lastName: 'Khoso', gender: 'Male',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Tando Muhammad Khan', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.48, cpn: 80.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 2, hostelName: 'Lal Shahbaz Hostel', block: 'Block B', room: '202', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 88.2, rank: 21
  },
  {
    id: 22, studentId: 22, cnic: '41304-1234567-22', rollNumber: '2K22/SWE/22',
    name: 'Anum Buriro', firstName: 'Anum', lastName: 'Buriro', gender: 'Female',
    department: 'Software Engineering', deptCode: 'SWE', program: 'BS Software Engineering',
    district: 'Matiari', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.65, cpn: 84.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 4, hostelName: 'Under Graduate Girls Hostel', block: 'Block C', room: '203', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 92.4, rank: 22
  },
  {
    id: 23, studentId: 23, cnic: '41304-1234567-23', rollNumber: '2K22/IT/23',
    name: 'Hassan Larik', firstName: 'Hassan', lastName: 'Larik', gender: 'Male',
    department: 'Information Technology', deptCode: 'IT', program: 'BS Information Technology',
    district: 'Hyderabad', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.40, cpn: 79.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 5, hostelName: 'Allama Iqbal Hostel', block: 'Block B', room: '204', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 87.0, rank: 23
  },
  {
    id: 24, studentId: 24, cnic: '41304-1234567-24', rollNumber: '2K22/BBA/24',
    name: 'Khadija Kazi', firstName: 'Khadija', lastName: 'Kazi', gender: 'Female',
    department: 'Business Administration', deptCode: 'BBA', program: 'BBA',
    district: 'Jamshoro', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.75, cpn: 86.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 1, hostelName: 'Marvi Girls Hostel', block: 'Block C', room: '205', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 94.0, rank: 24
  },
  {
    id: 25, studentId: 25, cnic: '41304-1234567-25', rollNumber: '2K22/EE/25',
    name: 'Hussain Palh', firstName: 'Hussain', lastName: 'Palh', gender: 'Male',
    department: 'Electrical Engineering', deptCode: 'EE', program: 'BS Electrical Engineering',
    district: 'Dadu', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.32, cpn: 77.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 8, hostelName: 'Blocks Hostel', block: 'Block B', room: '206', bed: 'Bed-1',
    annualFeeStatus: 'Pending', annualFeeAmount: 25000, meritScore: 84.8, rank: 25
  },
  {
    id: 26, studentId: 26, cnic: '41304-1234567-26', rollNumber: '2K22/CE/26',
    name: 'Zayan Mallah', firstName: 'Zayan', lastName: 'Mallah', gender: 'Male',
    department: 'Civil Engineering', deptCode: 'CE', program: 'BS Civil Engineering',
    district: 'Mirpurkhas', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.30, cpn: 77.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 10, hostelName: 'Government Federal Hostel', block: 'Block B', room: '207', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 84.2, rank: 26
  },
  {
    id: 27, studentId: 27, cnic: '41304-1234567-27', rollNumber: '2K22/ENG/27',
    name: 'Iqra Panhwar', firstName: 'Iqra', lastName: 'Panhwar', gender: 'Female',
    department: 'English Literature', deptCode: 'ENG', program: 'BS English',
    district: 'Sukkur', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.60, cpn: 82.8,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 4, hostelName: 'Under Graduate Girls Hostel', block: 'Block D', room: '208', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 91.0, rank: 27
  },
  {
    id: 28, studentId: 28, cnic: '41304-1234567-28', rollNumber: '2K22/PHY/28',
    name: 'Danish Chang', firstName: 'Danish', lastName: 'Chang', gender: 'Male',
    department: 'Physics', deptCode: 'PHY', program: 'BS Physics',
    district: 'Larkana', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.52, cpn: 80.8,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 11, hostelName: 'Shaheed Zulfiqar Ali Bhutto Hostel', block: 'Block B', room: '209', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 88.8, rank: 28
  },
  {
    id: 29, studentId: 29, cnic: '41304-1234567-29', rollNumber: '2K22/CHEM/29',
    name: 'Mehreen Qureshi', firstName: 'Mehreen', lastName: 'Qureshi', gender: 'Female',
    department: 'Chemistry', deptCode: 'CHEM', program: 'BS Chemistry',
    district: 'Badin', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.58, cpn: 82.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 1, hostelName: 'Marvi Girls Hostel', block: 'Block D', room: '210', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 90.5, rank: 29
  },
  {
    id: 30, studentId: 30, cnic: '41304-1234567-30', rollNumber: '2K22/LAW/30',
    name: 'Sheraz Soomrani', firstName: 'Sheraz', lastName: 'Soomrani', gender: 'Male',
    department: 'Law', deptCode: 'LAW', program: 'LL.B',
    district: 'Thatta', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.42, cpn: 79.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 12, hostelName: 'Khan Bahadur Syed Allahndo Shah Hostel', block: 'Block B', room: '211', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 87.8, rank: 30
  },
  {
    id: 31, studentId: 31, cnic: '41304-1234567-31', rollNumber: '2K22/PHARM/31',
    name: 'Bisma Brohi', firstName: 'Bisma', lastName: 'Brohi', gender: 'Female',
    department: 'Pharmacy', deptCode: 'PHARM', program: 'Pharm.D',
    district: 'Tharparkar', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.80, cpn: 87.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 3, hostelName: 'Post Graduate (P.G) Girls Hostel', block: 'Block B', room: '212', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 32000, meritScore: 94.6, rank: 31
  },
  {
    id: 32, studentId: 32, cnic: '41304-1234567-32', rollNumber: '2K22/ECO/32',
    name: 'Kashif Jatoi', firstName: 'Kashif', lastName: 'Jatoi', gender: 'Male',
    department: 'Economics', deptCode: 'ECO', program: 'BS Economics',
    district: 'Naushahro Feroze', province: 'Sindh', academicYear: '2025-2026', semester: 4, cgpa: 3.36, cpn: 78.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 13, hostelName: 'Makhdoom Ameen Fahmeen Hostel', block: 'Block B', room: '213', bed: 'Bed-1',
    annualFeeStatus: 'Unpaid', annualFeeAmount: 25000, meritScore: 85.8, rank: 32
  },
  {
    id: 33, studentId: 33, cnic: '41304-1234567-33', rollNumber: '2K23/CSM/33',
    name: 'Nimra Unar', firstName: 'Nimra', lastName: 'Unar', gender: 'Female',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Khairpur', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.66, cpn: 83.8,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 1, hostelName: 'Marvi Girls Hostel', block: 'Block A', room: '301', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 91.8, rank: 33
  },
  {
    id: 34, studentId: 34, cnic: '41304-1234567-34', rollNumber: '2K23/SWE/34',
    name: 'Farhan Bhutto', firstName: 'Farhan', lastName: 'Bhutto', gender: 'Male',
    department: 'Software Engineering', deptCode: 'SWE', program: 'BS Software Engineering',
    district: 'Sanghar', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.50, cpn: 81.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 2, hostelName: 'Lal Shahbaz Hostel', block: 'Block C', room: '302', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 89.2, rank: 34
  },
  {
    id: 35, studentId: 35, cnic: '41304-1234567-35', rollNumber: '2K23/IT/35',
    name: 'Mahnoor Solangi', firstName: 'Mahnoor', lastName: 'Solangi', gender: 'Female',
    department: 'Information Technology', deptCode: 'IT', program: 'BS Information Technology',
    district: 'Shikarpur', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.59, cpn: 82.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Allocated',
    isResident: true, hostelId: 4, hostelName: 'Under Graduate Girls Hostel', block: 'Block A', room: '303', bed: 'Bed-1',
    annualFeeStatus: 'Paid', annualFeeAmount: 25000, meritScore: 90.8, rank: 35
  },

  // ── Applicants In Processing / Merit Applicants (36 to 55) ──
  {
    id: 36, studentId: 36, cnic: '41304-1234567-36', rollNumber: '2K23/BBA/36',
    name: 'Imran Mangi', firstName: 'Imran', lastName: 'Mangi', gender: 'Male',
    department: 'Business Administration', deptCode: 'BBA', program: 'BBA',
    district: 'Jacobabad', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.25, cpn: 75.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 82.0, rank: 36
  },
  {
    id: 37, studentId: 37, cnic: '41304-1234567-37', rollNumber: '2K23/EE/37',
    name: 'Sadia Syed', firstName: 'Sadia', lastName: 'Syed', gender: 'Female',
    department: 'Electrical Engineering', deptCode: 'EE', program: 'BS Electrical Engineering',
    district: 'Ghotki', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.52, cpn: 81.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 88.6, rank: 37
  },
  {
    id: 38, studentId: 38, cnic: '41304-1234567-38', rollNumber: '2K23/CE/38',
    name: 'Kamran Abro', firstName: 'Kamran', lastName: 'Abro', gender: 'Male',
    department: 'Civil Engineering', deptCode: 'CE', program: 'BS Civil Engineering',
    district: 'Kashmore', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.18, cpn: 74.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 80.5, rank: 38
  },
  {
    id: 39, studentId: 39, cnic: '41304-1234567-39', rollNumber: '2K23/ENG/39',
    name: 'Syeda Mahar', firstName: 'Syeda', lastName: 'Mahar', gender: 'Female',
    department: 'English Literature', deptCode: 'ENG', program: 'BS English',
    district: 'Umerkot', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.48, cpn: 80.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 87.4, rank: 39
  },
  {
    id: 40, studentId: 40, cnic: '41304-1234567-40', rollNumber: '2K23/PHY/40',
    name: 'Zahir Chandio', firstName: 'Zahir', lastName: 'Chandio', gender: 'Male',
    department: 'Physics', deptCode: 'PHY', program: 'BS Physics',
    district: 'Tando Allahyar', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.22, cpn: 75.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 81.2, rank: 40
  },
  {
    id: 41, studentId: 41, cnic: '41304-1234567-41', rollNumber: '2K23/CHEM/41',
    name: 'Sidra Memon', firstName: 'Sidra', lastName: 'Memon', gender: 'Female',
    department: 'Chemistry', deptCode: 'CHEM', program: 'BS Chemistry',
    district: 'Tando Muhammad Khan', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.55, cpn: 81.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 89.0, rank: 41
  },
  {
    id: 42, studentId: 42, cnic: '41304-1234567-42', rollNumber: '2K23/LAW/42',
    name: 'Adeel Khoso', firstName: 'Adeel', lastName: 'Khoso', gender: 'Male',
    department: 'Law', deptCode: 'LAW', program: 'LL.B',
    district: 'Matiari', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.30, cpn: 76.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 83.0, rank: 42
  },
  {
    id: 43, studentId: 43, cnic: '41304-1234567-43', rollNumber: '2K23/PHARM/43',
    name: 'Tayyaba Buriro', firstName: 'Tayyaba', lastName: 'Buriro', gender: 'Female',
    department: 'Pharmacy', deptCode: 'PHARM', program: 'Pharm.D',
    district: 'Hyderabad', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.70, cpn: 85.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 93.2, rank: 43
  },
  {
    id: 44, studentId: 44, cnic: '41304-1234567-44', rollNumber: '2K23/ECO/44',
    name: 'Waseem Larik', firstName: 'Waseem', lastName: 'Larik', gender: 'Male',
    department: 'Economics', deptCode: 'ECO', program: 'BS Economics',
    district: 'Jamshoro', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.15, cpn: 73.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 79.5, rank: 44
  },
  {
    id: 45, studentId: 45, cnic: '41304-1234567-45', rollNumber: '2K23/CSM/45',
    name: 'Areeba Kazi', firstName: 'Areeba', lastName: 'Kazi', gender: 'Female',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Dadu', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.64, cpn: 83.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 91.2, rank: 45
  },
  {
    id: 46, studentId: 46, cnic: '41304-1234567-46', rollNumber: '2K23/SWE/46',
    name: 'Saeed Palh', firstName: 'Saeed', lastName: 'Palh', gender: 'Male',
    department: 'Software Engineering', deptCode: 'SWE', program: 'BS Software Engineering',
    district: 'Mirpurkhas', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.28, cpn: 76.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 82.5, rank: 46
  },
  {
    id: 47, studentId: 47, cnic: '41304-1234567-47', rollNumber: '2K23/IT/47',
    name: 'Bushra Mallah', firstName: 'Bushra', lastName: 'Mallah', gender: 'Female',
    department: 'Information Technology', deptCode: 'IT', program: 'BS Information Technology',
    district: 'Sukkur', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.50, cpn: 80.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 88.0, rank: 47
  },
  {
    id: 48, studentId: 48, cnic: '41304-1234567-48', rollNumber: '2K23/BBA/48',
    name: 'Shoaib Panhwar', firstName: 'Shoaib', lastName: 'Panhwar', gender: 'Male',
    department: 'Business Administration', deptCode: 'BBA', program: 'BBA',
    district: 'Larkana', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.12, cpn: 73.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 78.8, rank: 48
  },
  {
    id: 49, studentId: 49, cnic: '41304-1234567-49', rollNumber: '2K23/EE/49',
    name: 'Kinza Chang', firstName: 'Kinza', lastName: 'Chang', gender: 'Female',
    department: 'Electrical Engineering', deptCode: 'EE', program: 'BS Electrical Engineering',
    district: 'Badin', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.58, cpn: 82.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 89.8, rank: 49
  },
  {
    id: 50, studentId: 50, cnic: '41304-1234567-50', rollNumber: '2K23/CE/50',
    name: 'Nida Qureshi', firstName: 'Nida', lastName: 'Qureshi', gender: 'Female',
    department: 'Civil Engineering', deptCode: 'CE', program: 'BS Civil Engineering',
    district: 'Thatta', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.45, cpn: 79.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 86.8, rank: 50
  },
  {
    id: 51, studentId: 51, cnic: '41304-1234567-51', rollNumber: '2K23/ENG/51',
    name: 'Sobiah Soomrani', firstName: 'Sobiah', lastName: 'Soomrani', gender: 'Female',
    department: 'English Literature', deptCode: 'ENG', program: 'BS English',
    district: 'Tharparkar', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.52, cpn: 81.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 88.4, rank: 51
  },
  {
    id: 52, studentId: 52, cnic: '41304-1234567-52', rollNumber: '2K23/PHY/52',
    name: 'Mona Brohi', firstName: 'Mona', lastName: 'Brohi', gender: 'Female',
    department: 'Physics', deptCode: 'PHY', program: 'BS Physics',
    district: 'Naushahro Feroze', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.40, cpn: 78.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 85.0, rank: 52
  },
  {
    id: 53, studentId: 53, cnic: '41304-1234567-53', rollNumber: '2K23/CHEM/53',
    name: 'Sumaira Jatoi', firstName: 'Sumaira', lastName: 'Jatoi', gender: 'Female',
    department: 'Chemistry', deptCode: 'CHEM', program: 'BS Chemistry',
    district: 'Khairpur', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.49, cpn: 80.2,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 87.0, rank: 53
  },

  // ── Non-Processed / Ineligible / Special Cases (54 to 60) ──
  {
    id: 54, studentId: 54, cnic: '41304-1234567-54', rollNumber: '2K23/LAW/54',
    name: 'Mehwish Unar', firstName: 'Mehwish', lastName: 'Unar', gender: 'Female',
    department: 'Law', deptCode: 'LAW', program: 'LL.B',
    district: 'Sanghar', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.35, cpn: 77.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Not Processed',
    isResident: false, meritScore: 83.5, rank: 54
  },
  {
    id: 55, studentId: 55, cnic: '41304-1234567-55', rollNumber: '2K23/PHARM/55',
    name: 'Samina Bhutto', firstName: 'Samina', lastName: 'Bhutto', gender: 'Female',
    department: 'Pharmacy', deptCode: 'PHARM', program: 'Pharm.D',
    district: 'Shikarpur', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.65, cpn: 84.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 92.0, rank: 55
  },
  {
    id: 56, studentId: 56, cnic: '41304-1234567-56', rollNumber: '2K23/ECO/56',
    name: 'Amber Solangi', firstName: 'Amber', lastName: 'Solangi', gender: 'Female',
    department: 'Economics', deptCode: 'ECO', program: 'BS Economics',
    district: 'Jacobabad', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.20, cpn: 74.5,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'In Processing',
    isResident: false, meritScore: 80.0, rank: 56
  },
  {
    id: 57, studentId: 57, cnic: '41304-1234567-57', rollNumber: '2K23/CSM/57',
    name: 'Owais Mangi', firstName: 'Owais', lastName: 'Mangi', gender: 'Male',
    department: 'Computer Science', deptCode: 'CSM', program: 'BS Computer Science',
    district: 'Ghotki', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 2.10, cpn: 52.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Ineligible',
    isResident: false, meritScore: 55.0, rank: 57
  },
  {
    id: 58, studentId: 58, cnic: '41304-1234567-58', rollNumber: '2K23/SWE/58',
    name: 'Danish Syed', firstName: 'Danish', lastName: 'Syed', gender: 'Male',
    department: 'Software Engineering', deptCode: 'SWE', program: 'BS Software Engineering',
    district: 'Jamshoro', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 2.30, cpn: 55.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Ineligible',
    isResident: false, meritScore: 58.0, rank: 58
  },
  {
    id: 59, studentId: 59, cnic: '41304-1234567-59', rollNumber: '2K23/IT/59',
    name: 'Kashif Mahar', firstName: 'Kashif', lastName: 'Mahar', gender: 'Male',
    department: 'Information Technology', deptCode: 'IT', program: 'BS Information Technology',
    district: 'Kashmore', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.10, cpn: 72.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Not Processed',
    isResident: false, meritScore: 77.0, rank: 59
  },
  {
    id: 60, studentId: 60, cnic: '41304-1234567-60', rollNumber: '2K23/BBA/60',
    name: 'Farhan Chandio', firstName: 'Farhan', lastName: 'Chandio', gender: 'Male',
    department: 'Business Administration', deptCode: 'BBA', program: 'BBA',
    district: 'Umerkot', province: 'Sindh', academicYear: '2025-2026', semester: 2, cgpa: 3.05, cpn: 71.0,
    campus: 'Allama I.I. Kazi Campus (Main Campus)', status: 'Not Processed',
    isResident: false, meritScore: 76.0, rank: 60
  }
];

// Helper transformers to get data for specific component DTOs
export function getUniformStudentDtos() {
  return UNIFORM_STUDENTS.map(s => ({
    studentId: s.studentId,
    cnic: s.cnic,
    rollNumber: s.rollNumber,
    name: s.name,
    department: s.department,
    academicYear: s.academicYear,
    district: s.district,
    gender: s.gender
  }));
}

export function getUniformResidentDtos() {
  return UNIFORM_STUDENTS
    .filter(s => s.isResident)
    .map(s => ({
      residentId: 100 + s.studentId,
      studentId: s.studentId,
      studentName: s.name,
      cnic: s.cnic,
      rollNumber: s.rollNumber,
      department: s.department,
      district: s.district,
      gender: s.gender,
      hostelId: s.hostelId || 1,
      hostelName: s.hostelName || 'Lal Shahbaz Hostel',
      block: s.block || 'Block A',
      room: s.room || '101',
      bed: s.bed || 'Bed-1',
      academicYear: s.academicYear,
      annualFeeStatus: s.annualFeeStatus || 'Paid',
      annualFeeAmount: s.annualFeeAmount || 25000,
      status: 'Active' as const
    }));
}

export function getUniformApplicationsDtos() {
  return UNIFORM_STUDENTS.map(s => ({
    id: s.id,
    cnic: s.cnic,
    name: s.name,
    rollNo: s.rollNumber,
    department: s.department,
    province: s.province,
    district: s.district,
    campus: s.campus,
    batch: s.rollNumber.split('/')[0] || '2K21',
    status: s.status === 'Allocated' ? 'Room Allocated' : s.status,
    eligibilityReason: s.status === 'Ineligible' ? 'District and Academic CGPA requirement not met.' : 'Eligible'
  }));
}

export function getUniformMeritCandidates() {
  return UNIFORM_STUDENTS.map((s, idx) => ({
    id: s.id,
    cnic: s.cnic,
    name: s.name,
    rollNo: s.rollNumber,
    department: s.department,
    province: s.province,
    district: s.district,
    campus: s.campus,
    batch: s.rollNumber.split('/')[0] || '2K21',
    status: s.status === 'Allocated' ? 'Room Allocated' : s.status,
    eligibilityReason: s.status === 'Ineligible' ? 'Academic CGPA requirement not met.' : 'Eligible',
    districtAllowed: true,
    campusAllowed: true,
    otherEligible: s.status !== 'Ineligible',
    meritScore: s.meritScore || parseFloat((95.0 - idx * 0.6).toFixed(2)),
    rank: idx + 1,
    allocatedHostel: s.isResident ? s.hostelName : undefined
  }));
}
