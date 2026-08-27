// =============================================================================
// Infrastructure/Persistence/DbInitializer.cs
// Automatic Database Seeder for Sindh University Hostel Portal
// Seeds demo data for Admin, Existing Residents, and Fresh Applicants
// =============================================================================
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 1. Ensure database and tables are created
        if (context.Database.IsSqlite())
        {
            await context.Database.EnsureCreatedAsync();
        }
        else
        {
            await context.Database.MigrateAsync();
        }

        // 2. Seed Academic Year if missing
        var currentYear = await context.AcademicYears.FirstOrDefaultAsync(y => y.IsActive);
        if (currentYear == null)
        {
            currentYear = new AcademicYear
            {
                Label = "2025–2026",
                StartDate = new DateOnly(2025, 9, 1),
                EndDate = new DateOnly(2026, 8, 31),
                IsActive = true
            };
            context.AcademicYears.Add(currentYear);
            await context.SaveChangesAsync();
        }

        // 3. Seed Districts if missing
        if (!await context.Districts.AnyAsync())
        {
            var districts = new[]
            {
                new District { Name = "Hyderabad", Province = "Sindh" },
                new District { Name = "Jamshoro", Province = "Sindh" },
                new District { Name = "Dadu", Province = "Sindh" },
                new District { Name = "Badin", Province = "Sindh" },
                new District { Name = "Sukkur", Province = "Sindh" },
                new District { Name = "Larkana", Province = "Sindh" }
            };
            context.Districts.AddRange(districts);
            await context.SaveChangesAsync();
        }

        var hydDistrict = await context.Districts.FirstAsync(d => d.Name == "Hyderabad");
        var jamDistrict = await context.Districts.FirstAsync(d => d.Name == "Jamshoro");

        // 4. Seed Hostels, Blocks, Rooms & Beds if missing
        if (!await context.Hostels.AnyAsync())
        {
            var maleHostel = new Hostel
            {
                Name = "Allama Iqbal Hostel",
                Gender = Gender.Male,
                TotalCapacity = 100,
                Address = "University of Sindh, Jamshoro",
                Description = "Main Boys Hostel with study hall and Wi-Fi facilities.",
                Warden = "Prof. Dr. Ghulam Murtaza",
                WardenPhone = "+92-300-1234567",
                IsActive = true
            };

            var femaleHostel = new Hostel
            {
                Name = "Fatima Jinnah Girls Hostel",
                Gender = Gender.Female,
                TotalCapacity = 80,
                Address = "University of Sindh, Jamshoro",
                Description = "Girls Hostel with 24/7 security and mess hall.",
                Warden = "Dr. Shahnaz Memon",
                WardenPhone = "+92-300-7654321",
                IsActive = true
            };

            context.Hostels.AddRange(maleHostel, femaleHostel);
            await context.SaveChangesAsync();

            // Create Blocks & Rooms for Male Hostel
            var blockA = new Block { HostelId = maleHostel.HostelId, BlockName = "Block A" };
            context.Blocks.Add(blockA);
            await context.SaveChangesAsync();

            var floor1 = new Floor { BlockId = blockA.BlockId, FloorNumber = 1 };
            context.Floors.Add(floor1);
            await context.SaveChangesAsync();

            var room204 = new Room { FloorId = floor1.FloorId, RoomNumber = "204" };
            context.Rooms.Add(room204);
            await context.SaveChangesAsync();

            var bed1 = new Bed { RoomId = room204.RoomId, BedLabel = "Bed-1", IsAvailable = false };
            var bed2 = new Bed { RoomId = room204.RoomId, BedLabel = "Bed-2", IsAvailable = true };
            context.Beds.AddRange(bed1, bed2);
            await context.SaveChangesAsync();

            // Create Blocks & Rooms for Female Hostel
            var femaleBlockA = new Block { HostelId = femaleHostel.HostelId, BlockName = "Block A" };
            context.Blocks.Add(femaleBlockA);
            await context.SaveChangesAsync();

            var fFloor1 = new Floor { BlockId = femaleBlockA.BlockId, FloorNumber = 1 };
            context.Floors.Add(fFloor1);
            await context.SaveChangesAsync();

            var room101 = new Room { FloorId = fFloor1.FloorId, RoomNumber = "101" };
            context.Rooms.Add(room101);
            await context.SaveChangesAsync();

            var fBed1 = new Bed { RoomId = room101.RoomId, BedLabel = "Bed-1", IsAvailable = true };
            var fBed2 = new Bed { RoomId = room101.RoomId, BedLabel = "Bed-2", IsAvailable = true };
            context.Beds.AddRange(fBed1, fBed2);
            await context.SaveChangesAsync();
        }

        // 5. Seed Simulated University Records for Verification
        if (!await context.SimulatedUniversityRecords.AnyAsync(r => r.Cnic == "4130412345671"))
        {
            var simRecord1 = new SimulatedUniversityRecord
            {
                RollNumber = "2K21/CS/101",
                Cnic = "4130412345671",
                FullName = "Ali Khan",
                FatherName = "Muhammad Khan",
                Address = "House #123, Model Town, Hyderabad",
                DistrictName = "Hyderabad",
                Province = "Sindh",
                DepartmentName = "Computer Science",
                ProgramName = "BS Computer Science",
                DegreeType = DegreeType.BS,
                Semester = 7,
                Cgpa = 3.75m,
                Cpn = 78.50m,
                AcademicYear = "2025–2026",
                Gender = Gender.Male,
                DateOfBirth = new DateOnly(2002, 5, 14),
                IsActive = true
            };

            var simRecord2 = new SimulatedUniversityRecord
            {
                RollNumber = "2K24/CS/202",
                Cnic = "4130476543212",
                FullName = "Sara Ahmed",
                FatherName = "Ahmed Hassan",
                Address = "Flat 4, Society Area, Jamshoro",
                DistrictName = "Jamshoro",
                Province = "Sindh",
                DepartmentName = "Software Engineering",
                ProgramName = "BS Software Engineering",
                DegreeType = DegreeType.BS,
                Semester = 1,
                Cgpa = 3.85m,
                Cpn = 82.50m,
                AcademicYear = "2025–2026",
                Gender = Gender.Female,
                DateOfBirth = new DateOnly(2005, 8, 20),
                IsActive = true
            };

            var simRecord3 = new SimulatedUniversityRecord
            {
                RollNumber = "2K24/CS/303",
                Cnic = "4130499887766",
                FullName = "Tariq Mahmood",
                FatherName = "Mahmood Ahmed",
                Address = "Station Road, Dadu",
                DistrictName = "Dadu",
                Province = "Sindh",
                DepartmentName = "Computer Science",
                ProgramName = "BS Computer Science",
                DegreeType = DegreeType.BS,
                Semester = 1,
                Cgpa = 3.60m,
                Cpn = 79.20m,
                AcademicYear = "2025–2026",
                Gender = Gender.Male,
                DateOfBirth = new DateOnly(2004, 3, 15),
                IsActive = true
            };

            var simRecord4 = new SimulatedUniversityRecord
            {
                RollNumber = "2K24/CS/404",
                Cnic = "4130455443322",
                FullName = "Zainab Fatima",
                FatherName = "Fatima Gul",
                Address = "Civil Lines, Sukkur",
                DistrictName = "Sukkur",
                Province = "Sindh",
                DepartmentName = "Information Technology",
                ProgramName = "BS Information Technology",
                DegreeType = DegreeType.BS,
                Semester = 1,
                Cgpa = 3.90m,
                Cpn = 84.10m,
                AcademicYear = "2025–2026",
                Gender = Gender.Female,
                DateOfBirth = new DateOnly(2005, 11, 10),
                IsActive = true
            };

            context.SimulatedUniversityRecords.AddRange(simRecord1, simRecord2, simRecord3, simRecord4);
            await context.SaveChangesAsync();
        }

        // 6. Seed Admin User
        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@usindh.edu.pk");
        if (adminUser == null)
        {
            adminUser = new User
            {
                Email = "admin@usindh.edu.pk",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FirstName = "Hostel",
                LastName = "Provost",
                Role = UserRole.Admin,
                IsActive = true,
                PhoneNumber = "+923001112233"
            };
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            var adminEntity = new Admin
            {
                UserId = adminUser.UserId,
                EmployeeId = "EMP-001",
                Department = "Hostel Management Cell"
            };
            context.Admins.Add(adminEntity);
            await context.SaveChangesAsync();
        }

        // 6b. Seed AdminSettings
        if (!await context.AdminSettings.AnyAsync())
        {
            context.AdminSettings.Add(new AdminSettings
            {
                AllocationOpen = true,
                AllocationDeadline = DateTime.UtcNow.AddDays(30),
                MaxAllocationPerCycle = 100,
                AllocationEnabled = true,
                EffectiveFrom = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
        }

        // 7. Seed Student 1 — Existing Resident (CNIC: 4130412345671, Password: Student@123)
        var residentUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "ali.khan@usindh.edu.pk");
        if (residentUser == null)
        {
            residentUser = new User
            {
                Email = "ali.khan@usindh.edu.pk",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                FirstName = "Ali",
                LastName = "Khan",
                Role = UserRole.Student,
                IsActive = true,
                PhoneNumber = "+923001234567"
            };
            context.Users.Add(residentUser);
            await context.SaveChangesAsync();

            var residentStudent = new Student
            {
                UserId = residentUser.UserId,
                Cnic = "4130412345671",
                RegistrationNumber = "2K21/CS/101",
                Gender = Gender.Male,
                DateOfBirth = new DateOnly(2002, 5, 14),
                DistrictId = hydDistrict.DistrictId,
                Profile = new StudentProfile
                {
                    HomeAddress = "House #123, Model Town, Hyderabad",
                    City = "Hyderabad",
                    GuardianName = "Muhammad Khan",
                    GuardianPhone = "+923009876543"
                },
                UniversityRecord = new UniversityStudentRecord
                {
                    Semester = 7,
                    Cgpa = 3.75m,
                    IsVerified = true,
                    VerifiedAt = DateTime.UtcNow,
                    VerifiedBy = "SYSTEM_SEED"
                }
            };
            context.Students.Add(residentStudent);
            await context.SaveChangesAsync();

            // Create Application for Resident
            var resApplication = new Domain.Entities.Application
            {
                StudentId = residentStudent.StudentId,
                AcademicYearId = currentYear.AcademicYearId,
                Status = ApplicationStatus.RoomAllocated,
                SubmittedAt = DateTime.UtcNow.AddMonths(-6)
            };
            context.Applications.Add(resApplication);
            await context.SaveChangesAsync();

            // Existing Resident Allocation & Bed assignment
            var assignedBed = await context.Beds.FirstAsync(b => b.BedLabel == "Bed-1");
            var allocation = new Allocation
            {
                ApplicationId = resApplication.ApplicationId,
                StudentId = residentStudent.StudentId,
                BedId = assignedBed.BedId,
                AllocatedAt = DateTime.UtcNow.AddMonths(-6),
                IsActive = true
            };
            context.Allocations.Add(allocation);
            await context.SaveChangesAsync();

            var residentRecord = new Resident
            {
                AllocationId = allocation.AllocationId,
                CheckInDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6)),
                IsCurrentResident = true
            };
            context.Residents.Add(residentRecord);
            await context.SaveChangesAsync();
        }

        // 8. Seed Student 2 — Fresh Applicant (CNIC: 4130476543212, Password: Student@123)
        var applicantUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "sara.ahmed@usindh.edu.pk");
        if (applicantUser == null)
        {
            applicantUser = new User
            {
                Email = "sara.ahmed@usindh.edu.pk",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                FirstName = "Sara",
                LastName = "Ahmed",
                Role = UserRole.Student,
                IsActive = true,
                PhoneNumber = "+923007654321"
            };
            context.Users.Add(applicantUser);
            await context.SaveChangesAsync();

            var applicantStudent = new Student
            {
                UserId = applicantUser.UserId,
                Cnic = "4130476543212",
                RegistrationNumber = "2K24/CS/202",
                Gender = Gender.Female,
                DateOfBirth = new DateOnly(2005, 8, 20),
                DistrictId = jamDistrict.DistrictId,
                Profile = new StudentProfile
                {
                    HomeAddress = "Flat 4, Society Area, Jamshoro",
                    City = "Jamshoro",
                    GuardianName = "Ahmed Hassan",
                    GuardianPhone = "+923008765432"
                },
                UniversityRecord = new UniversityStudentRecord
                {
                    Semester = 1,
                    Cgpa = 3.85m,
                    IsVerified = true,
                    VerifiedAt = DateTime.UtcNow,
                    VerifiedBy = "SYSTEM_SEED"
                }
            };
            context.Students.Add(applicantStudent);
            await context.SaveChangesAsync();

            // Create Application & Processing Fee
            var application = new Domain.Entities.Application
            {
                StudentId = applicantStudent.StudentId,
                AcademicYearId = currentYear.AcademicYearId,
                Status = ApplicationStatus.Submitted,
                SubmittedAt = DateTime.UtcNow.AddDays(-2)
            };
            context.Applications.Add(application);
            await context.SaveChangesAsync();

            var femaleHostel = await context.Hostels.FirstAsync(h => h.Gender == Gender.Female);
            var preference = new ApplicationHostelPreference
            {
                ApplicationId = application.ApplicationId,
                HostelId = femaleHostel.HostelId,
                PreferenceOrder = 1
            };
            context.ApplicationHostelPreferences.Add(preference);
            await context.SaveChangesAsync();

            var fee = new ProcessingFee
            {
                ApplicationId = application.ApplicationId,
                Amount = 1500,
                Status = FeeStatus.Paid,
                DueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7))
            };
            context.ProcessingFees.Add(fee);
            await context.SaveChangesAsync();

            var merit = new MeritResult
            {
                ApplicationId = application.ApplicationId,
                RollNumber = "2K24/CS/202",
                Department = "Software Engineering",
                AcademicYear = "2025–2026",
                Program = "BS Software Engineering",
                Cpn = 82.50m,
                Cgpa = 3.85m,
                District = "Jamshoro",
                Gender = "Female",
                IsEligible = true,
                MeritScore = 82.5000m,
                MeritRank = 3,
                AllocationStatus = AllocationStatus.Pending
            };
            context.MeritResults.Add(merit);
            await context.SaveChangesAsync();
        }
    }
}
