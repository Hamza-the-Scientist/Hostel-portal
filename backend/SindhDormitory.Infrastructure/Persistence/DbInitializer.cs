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

        // 4. Seed Hostels, Blocks, Rooms & Beds if missing or incomplete
        if (await context.Hostels.CountAsync() < 13)
        {
            var existingNames = await context.Hostels.Select(h => h.Name.ToLower()).ToListAsync();

            var seedHostels = new List<(Hostel hostel, string[] amenities, string[] images)>
            {
                (
                    new Hostel
                    {
                        Name = "Marvi Girls Hostel",
                        Gender = Gender.Female,
                        Address = "Girls Hostel Complex, Main Campus",
                        TotalCapacity = 683,
                        Description = "The premier girls hostel offering top-notch security, beautiful central garden, and nutritious hygienic food options.",
                        EligibilityRequirement = "Must be a full-time enrolled student domiciled in designated Sindh quota districts outside Jamshoro.",
                        Warden = "Prof. Dr. Shaheen Shah",
                        WardenPhone = "+92 300 9876543",
                        IsActive = true
                    },
                    new[] { "High-Speed WiFi", "24/7 Female Security", "In-House Mess", "Lush Green Lawn", "Reading Room", "Attached Bathroom" },
                    new[] { "/images/marvi-hostel.jpeg" }
                ),
                (
                    new Hostel
                    {
                        Name = "Lal Shahbaz Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 412,
                        Description = "Named after the revered Sufi saint, this hostel combines traditional architecture with active student sports culture and spacious rooms.",
                        EligibilityRequirement = "Regular enrolled male student of University of Sindh.",
                        Warden = "Engr. Mansoor Ali Soomro",
                        WardenPhone = "+92 312 4567890",
                        IsActive = true
                    },
                    new[] { "High-Speed WiFi", "Reading Hall", "Cafeteria", "Sports Ground", "Guarded Gate", "Common Bathroom" },
                    new[] { "/images/lal-shahbaz-hostel.jpeg" }
                ),
                (
                    new Hostel
                    {
                        Name = "P.G Girl Hostel",
                        Gender = Gender.Female,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 204,
                        Description = "The largest capacity hostel on campus, known for its bustling student community, budget-friendly mess facility, and open courtyard.",
                        EligibilityRequirement = "Postgraduate & Master female scholars of University of Sindh.",
                        Warden = "Prof. Fiza",
                        WardenPhone = "+92 333 9876542",
                        IsActive = true
                    },
                    new[] { "24/7 Security & CCTV", "Subsidized Mess", "Laundry Area", "Indoor Games", "Generator", "Attached Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Under Graduate Girls Hostel",
                        Gender = Gender.Female,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 451,
                        Description = "A cozy, lower-density residential block providing a quiet and focused environment ideal for Under Graduate female students.",
                        EligibilityRequirement = "Enrolled undergraduate female student.",
                        Warden = "Dr. Ghulam Mustafa Shah",
                        WardenPhone = "+92 300 1122334",
                        IsActive = true
                    },
                    new[] { "WiFi", "Quiet Study Area", "Filtered Water", "Security Guard", "Common Room", "Common Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Allama Iqbal Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 420,
                        Description = "A vibrant boys' hostel offering a balanced academic atmosphere, large common areas, and quick access to central campus departments.",
                        EligibilityRequirement = "Enrolled male student with minimum 2.5 CGPA.",
                        Warden = "Dr. Farooq Ahmed Memon",
                        WardenPhone = "+92 301 2345671",
                        IsActive = true
                    },
                    new[] { "WiFi", "Mess & Dining", "24/7 Security", "Study Room", "Water Plant", "Common Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Sindh University Teachers Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 75,
                        Description = "Reserved for eligible university teachers and research fellows, offering well-maintained gardens and peace of mind.",
                        EligibilityRequirement = "Faculty members and research scholars.",
                        Warden = "Mr. Abdul Rasheed Kalhoro",
                        WardenPhone = "+92 305 6677889",
                        IsActive = true
                    },
                    new[] { "WiFi", "Dedicated Dining Hall", "24/7 Power Backup", "Parking Space", "Gardens", "Attached Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Sindh University Employees Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 75,
                        Description = "Reserved for eligible university staff sons and research fellows, offering well-maintained gardens and peace of mind.",
                        EligibilityRequirement = "University staff dependants and scholars.",
                        Warden = "Mr. Abdul Rasheed Kalhoro",
                        WardenPhone = "+92 305 6677889",
                        IsActive = true
                    },
                    new[] { "WiFi", "Dedicated Dining Hall", "24/7 Power Backup", "Parking Space", "Gardens", "Common Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Blocks Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 180,
                        Description = "Compact residential block featuring an active badminton court and easy access to the central university library.",
                        EligibilityRequirement = "Undergraduate male students.",
                        Warden = "Mr. Imtiaz Ahmed Khoso",
                        WardenPhone = "+92 334 5544332",
                        IsActive = true
                    },
                    new[] { "Mess Facility", "RO Water Plant", "Study Room", "Night Security", "Badminton Court", "Common Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Shaheed Benazir Bhutto International Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus, Jamshoro",
                        TotalCapacity = 338,
                        Description = "Specially designed to accommodate international exchange students and scholars with premium amenities and climate control.",
                        EligibilityRequirement = "International exchange students and postgraduate research fellows.",
                        Warden = "Prof. Dr. Zahid Hussain Nizamani",
                        WardenPhone = "+92 313 7766554",
                        IsActive = true
                    },
                    new[] { "Air Conditioned Rooms", "International Mess", "24/7 Security & Access Control", "High-Speed WiFi", "Laundry Service", "Attached Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Government Federal Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus",
                        TotalCapacity = 570,
                        Description = "Focuses on creating a disciplined yet supportive home-like environment for undergraduate scholars.",
                        EligibilityRequirement = "Federal & provincial quota scholars.",
                        Warden = "Dr. Sultan",
                        WardenPhone = "+92 303 5566778",
                        IsActive = true
                    },
                    new[] { "WiFi", "Study Lounge", "Clean Dining", "24/7 Security Gate", "Medical First Aid", "Common Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Shaheed Zulfiqar Ali Bhutto Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus",
                        TotalCapacity = 200,
                        Description = "Known for its friendly courtyard gathering space, delicious weekend mess menus, and quiet study quarters.",
                        EligibilityRequirement = "Enrolled male scholars.",
                        Warden = "Mrs. Farz Memon",
                        WardenPhone = "+92 315 8899001",
                        IsActive = true
                    },
                    new[] { "High-Speed WiFi", "Nutritious Mess Menu", "Computer Room", "Courtyard Garden", "24/7 Guarded Gate", "Common Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Khan Bahadur Syed Allahando Shah Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus",
                        TotalCapacity = 320,
                        Description = "Features a dedicated quiet study library open 24 hours during exam seasons and reliable solar power backup.",
                        EligibilityRequirement = "Enrolled male students.",
                        Warden = "Dr. Awais Unar",
                        WardenPhone = "+92 307 1122445",
                        IsActive = true
                    },
                    new[] { "WiFi", "Silent Study Library", "Solar Power Generator", "Purified Water Plant", "Security Staff", "Attached Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80" }
                ),
                (
                    new Hostel
                    {
                        Name = "Makhdoom Ameen Fahmeen Hostel",
                        Gender = Gender.Male,
                        Address = "Main Campus",
                        TotalCapacity = 184,
                        Description = "Conveniently located near the central departmental block with an in-house tuck shop and comprehensive healthcare support.",
                        EligibilityRequirement = "Enrolled male students.",
                        Warden = "Prof. Dr. Farz Baloch",
                        WardenPhone = "+92 336 9900112",
                        IsActive = true
                    },
                    new[] { "WiFi", "Central Mess", "Tuck Shop", "Medical Room", "24/7 Security Gate", "Common Bathroom" },
                    new[] { "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80" }
                )
            };

            foreach (var item in seedHostels)
            {
                if (!existingNames.Contains(item.hostel.Name.ToLower()))
                {
                    context.Hostels.Add(item.hostel);
                    await context.SaveChangesAsync();

                    foreach (var am in item.amenities)
                    {
                        context.HostelAmenities.Add(new HostelAmenity
                        {
                            HostelId = item.hostel.HostelId,
                            AmenityName = am
                        });
                    }

                    for (int i = 0; i < item.images.Length; i++)
                    {
                        context.HostelImages.Add(new HostelImage
                        {
                            HostelId = item.hostel.HostelId,
                            ImageUrl = item.images[i],
                            IsPrimary = (i == 0)
                        });
                    }

                    await context.SaveChangesAsync();
                }
            }
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
