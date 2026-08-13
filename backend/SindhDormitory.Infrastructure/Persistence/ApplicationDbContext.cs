// =============================================================================
// Infrastructure/Persistence/ApplicationDbContext.cs
// Full EF Core DbContext with all 30+ entities, constraints & indexes
// =============================================================================
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;
using SindhDormitory.Application.Interfaces;
using Application = SindhDormitory.Domain.Entities.Application;

namespace SindhDormitory.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // ── DbSets ────────────────────────────────────────────────────────────────
    public DbSet<User>                          Users                          { get; set; }
    public DbSet<Student>                       Students                       { get; set; }
    public DbSet<AdminSettings> AdminSettings { get; set; }
    public DbSet<StudentProfile>                StudentProfiles                { get; set; }
    public DbSet<UniversityStudentRecord>       UniversityStudentRecords       { get; set; }
    public DbSet<SimulatedUniversityRecord>    SimulatedUniversityRecords    { get; set; }
    public DbSet<District>                      Districts                      { get; set; }
    public DbSet<Department>                    Departments                    { get; set; }
    public DbSet<Domain.Entities.Program>       Programs                       { get; set; }
    public DbSet<AcademicYear>                  AcademicYears                  { get; set; }
    public DbSet<Hostel>                        Hostels                        { get; set; }
    public DbSet<HostelAmenity>                 HostelAmenities                { get; set; }
    public DbSet<HostelImage>                   HostelImages                   { get; set; }
    public DbSet<EligibilityRule>               EligibilityRules               { get; set; }
    public DbSet<EligibilityRuleValue>          EligibilityRuleValues          { get; set; }
    public DbSet<Admin>                         Admins                         { get; set; }

    public DbSet<Block>                         Blocks                         { get; set; }
    public DbSet<Floor>                         Floors                         { get; set; }
    public DbSet<Room>                          Rooms                          { get; set; }
    public DbSet<Bed>                           Beds                           { get; set; }
    public DbSet<Domain.Entities.Application>                   Applications                   { get; set; }
    public DbSet<ApplicationHostelPreference>   ApplicationHostelPreferences   { get; set; }
    public DbSet<ApplicationStatusHistory>      ApplicationStatusHistories     { get; set; }
    public DbSet<MeritResult>                   MeritResults                   { get; set; }
    public DbSet<AllocationCycle>               AllocationCycles               { get; set; }
    public DbSet<MeritWeightConfig>             MeritWeightConfigs             { get; set; }
    public DbSet<DistrictSeatRule>              DistrictSeatRules              { get; set; }
    public DbSet<Allocation>                    Allocations                    { get; set; }
    public DbSet<Resident>                      Residents                      { get; set; }
    public DbSet<ProcessingFee>                 ProcessingFees                 { get; set; }
    public DbSet<Challan>                       Challans                       { get; set; }
    public DbSet<Payment>                       Payments                       { get; set; }
    public DbSet<RoomChangeRequest>             RoomChangeRequests             { get; set; }
    public DbSet<Complaint>                     Complaints                     { get; set; }
    public DbSet<ComplaintAttachment>           ComplaintAttachments           { get; set; }
    public DbSet<Notification>                  Notifications                  { get; set; }
    public DbSet<Announcement>                  Announcements                  { get; set; }
    public DbSet<Review>                        Reviews                        { get; set; }
    public DbSet<ReviewRating>                  ReviewRatings                  { get; set; }
    public DbSet<AuditLog>                      AuditLogs                      { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Global soft-delete query filters ──────────────────────────────────
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Student>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Hostel>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Room>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Bed>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Allocation>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Complaint>().HasQueryFilter(e => !e.IsDeleted);

        // ── Users ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.UserId);
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.PasswordHash).HasMaxLength(512).IsRequired();
            e.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
            e.Property(u => u.LastName).HasMaxLength(100).IsRequired();
            e.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
            e.Property(u => u.PhoneNumber).HasMaxLength(20);
            e.Property(u => u.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            e.Property(u => u.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();
        });

        // ── Students ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Student>(e =>
        {
            e.HasKey(s => s.StudentId);
            e.Property(s => s.RegistrationNumber).HasMaxLength(50).IsRequired();
            e.HasIndex(s => s.RegistrationNumber).IsUnique();
            e.Property(s => s.Cnic).HasMaxLength(13).IsRequired();
            e.HasIndex(s => s.Cnic).IsUnique();
            e.Property(s => s.Gender).HasConversion<string>().HasMaxLength(10);
            e.HasOne(s => s.User)
                .WithOne(u => u.Student)
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(s => s.District)
                .WithMany(d => d.Students)
                .HasForeignKey(s => s.DistrictId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── Admins ────────────────────────────────────────────────────────────
        modelBuilder.Entity<Admin>(e =>
        {
            e.HasKey(a => a.AdminId);
            e.Property(a => a.EmployeeId).HasMaxLength(50).IsRequired();
            e.HasIndex(a => a.EmployeeId).IsUnique();
            e.Property(a => a.Department).HasMaxLength(100);
            e.HasOne(a => a.User)
                .WithOne(u => u.Admin)
                .HasForeignKey<Admin>(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── StudentProfiles ───────────────────────────────────────────────────
        modelBuilder.Entity<StudentProfile>(e =>
        {
            e.HasKey(p => p.ProfileId);
            e.HasOne(p => p.Student)
                .WithOne(s => s.Profile)
                .HasForeignKey<StudentProfile>(p => p.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
            e.Property(p => p.GuardianName).HasMaxLength(150);
            e.Property(p => p.GuardianPhone).HasMaxLength(20);
            e.Property(p => p.BloodGroup).HasMaxLength(5);
        });

        // ── UniversityStudentRecords ──────────────────────────────────────────
        modelBuilder.Entity<UniversityStudentRecord>(e =>
        {
            e.HasKey(r => r.RecordId);
            e.HasOne(r => r.Student)
                .WithOne(s => s.UniversityRecord)
                .HasForeignKey<UniversityStudentRecord>(r => r.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
            e.Property(r => r.Cgpa).HasPrecision(4, 2);
            e.HasOne(r => r.Program)
                .WithMany(p => p.UniversityStudentRecords)
                .HasForeignKey(r => r.ProgramId)
                .OnDelete(DeleteBehavior.SetNull);
            e.HasOne(r => r.Department)
                .WithMany(d => d.UniversityStudentRecords)
                .HasForeignKey(r => r.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── SimulatedUniversityRecords ────────────────────────────────────────
        modelBuilder.Entity<SimulatedUniversityRecord>(e =>
        {
            e.HasKey(r => r.RecordId);
            e.Property(r => r.FullName).HasMaxLength(150).IsRequired();
            e.Property(r => r.Cnic).HasMaxLength(13).IsRequired();
            e.HasIndex(r => r.Cnic).IsUnique();
            e.Property(r => r.RollNumber).HasMaxLength(50).IsRequired();
            e.HasIndex(r => r.RollNumber).IsUnique();
            e.Property(r => r.Cgpa).HasPrecision(4, 2);
            e.Property(r => r.Gender).HasConversion<string>().HasMaxLength(10);
            e.Property(r => r.DegreeType).HasConversion<string>().HasMaxLength(20);

            e.HasData(
                new SimulatedUniversityRecord
                {
                    RecordId = 1,
                    FullName = "Tariq Ahmed Soomro",
                    Cnic = "4120112345671",
                    RollNumber = "2K22/CS/101",
                    FatherName = "Ali Nawaz Soomro",
                    Address = "House 45, Sector B, Qasimabad",
                    DistrictName = "Hyderabad",
                    Province = "Sindh",
                    DepartmentName = "Computer Science",
                    ProgramName = "BS Computer Science",
                    DegreeType = DegreeType.BS,
                    Semester = 5,
                    Cgpa = 3.75m,
                    Cpn = 168.5m,
                    AcademicYear = "2025-2026",
                    Gender = Gender.Male,
                    DateOfBirth = new DateOnly(2003, 5, 14),
                    ProfilePictureUrl = "assets/demo-profiles/tariq.jpg",
                    IsActive = true
                },
                new SimulatedUniversityRecord
                {
                    RecordId = 2,
                    FullName = "Dua Fatima Shah",
                    Cnic = "4130212345672",
                    RollNumber = "2K22/CS/102",
                    FatherName = "Syed Ghulam Shah",
                    Address = "Village Bhit Shah, Taluka Matiari",
                    DistrictName = "Matiari",
                    Province = "Sindh",
                    DepartmentName = "Computer Science",
                    ProgramName = "BS Computer Science",
                    DegreeType = DegreeType.BS,
                    Semester = 5,
                    Cgpa = 3.88m,
                    Cpn = 174.0m,
                    AcademicYear = "2025-2026",
                    Gender = Gender.Female,
                    DateOfBirth = new DateOnly(2003, 8, 22),
                    ProfilePictureUrl = "assets/demo-profiles/dua.jpg",
                    IsActive = true
                },
                new SimulatedUniversityRecord
                {
                    RecordId = 3,
                    FullName = "Bilal Khan Chandio",
                    Cnic = "4110112345673",
                    RollNumber = "2K23/EE/45",
                    FatherName = "Mohammad Rahim Chandio",
                    Address = "Muhalla Station Road, Dadu",
                    DistrictName = "Dadu",
                    Province = "Sindh",
                    DepartmentName = "Electrical Engineering",
                    ProgramName = "BS Electrical Engineering",
                    DegreeType = DegreeType.BS,
                    Semester = 3,
                    Cgpa = 3.42m,
                    Cpn = 155.0m,
                    AcademicYear = "2025-2026",
                    Gender = Gender.Male,
                    DateOfBirth = new DateOnly(2004, 2, 10),
                    ProfilePictureUrl = "assets/demo-profiles/bilal.jpg",
                    IsActive = true
                },
                new SimulatedUniversityRecord
                {
                    RecordId = 4,
                    FullName = "Zainab Kalhoro",
                    Cnic = "4550412345674",
                    RollNumber = "2K21/ENG/12",
                    FatherName = "Nisar Kalhoro",
                    Address = "Flat 12, Royal Plaza, Sukkur",
                    DistrictName = "Sukkur",
                    Province = "Sindh",
                    DepartmentName = "English Language & Literature",
                    ProgramName = "BS English",
                    DegreeType = DegreeType.BS,
                    Semester = 7,
                    Cgpa = 3.65m,
                    Cpn = 161.5m,
                    AcademicYear = "2025-2026",
                    Gender = Gender.Female,
                    DateOfBirth = new DateOnly(2002, 11, 30),
                    ProfilePictureUrl = "assets/demo-profiles/zainab.jpg",
                    IsActive = true
                }
            );
        });

        // ── Districts ─────────────────────────────────────────────────────────
        modelBuilder.Entity<District>(e =>
        {
            e.HasKey(d => d.DistrictId);
            e.Property(d => d.Name).HasMaxLength(100).IsRequired();
            e.Property(d => d.Province).HasMaxLength(50).IsRequired();
            e.HasIndex(d => d.Name);
        });

        // ── Departments ───────────────────────────────────────────────────────
        modelBuilder.Entity<Department>(e =>
        {
            e.HasKey(d => d.DepartmentId);
            e.Property(d => d.Name).HasMaxLength(150).IsRequired();
            e.Property(d => d.Code).HasMaxLength(20).IsRequired();
            e.HasIndex(d => d.Code).IsUnique();
        });

        // ── Programs ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Domain.Entities.Program>(e =>
        {
            e.HasKey(p => p.ProgramId);
            e.Property(p => p.Name).HasMaxLength(150).IsRequired();
            e.Property(p => p.Code).HasMaxLength(20).IsRequired();
            e.HasIndex(p => p.Code).IsUnique();
            e.Property(p => p.DegreeType).HasConversion<string>().HasMaxLength(20);
            e.HasOne(p => p.Department)
                .WithMany(d => d.Programs)
                .HasForeignKey(p => p.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── AcademicYears ─────────────────────────────────────────────────────
        modelBuilder.Entity<AcademicYear>(e =>
        {
            e.HasKey(a => a.AcademicYearId);
            e.Property(a => a.Label).HasMaxLength(20).IsRequired();
            e.HasIndex(a => a.Label).IsUnique();
        });

        // ── Hostels ───────────────────────────────────────────────────────────
        modelBuilder.Entity<Hostel>(e =>
        {
            e.HasKey(h => h.HostelId);
            e.Property(h => h.Name).HasMaxLength(150).IsRequired();
            e.Property(h => h.Gender).HasConversion<string>().HasMaxLength(10);
            e.Property(h => h.Warden).HasMaxLength(150);
            e.Property(h => h.WardenPhone).HasMaxLength(20);
        });

        // ── HostelAmenities ───────────────────────────────────────────────────
        modelBuilder.Entity<HostelAmenity>(e =>
        {
            e.HasKey(a => a.AmenityId);
            e.Property(a => a.AmenityName).HasMaxLength(100).IsRequired();
            e.HasOne(a => a.Hostel)
                .WithMany(h => h.Amenities)
                .HasForeignKey(a => a.HostelId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── HostelImages ──────────────────────────────────────────────────────
        modelBuilder.Entity<HostelImage>(e =>
        {
            e.HasKey(i => i.ImageId);
            e.Property(i => i.ImageUrl).HasMaxLength(500).IsRequired();
            e.HasOne(i => i.Hostel)
                .WithMany(h => h.Images)
                .HasForeignKey(i => i.HostelId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── EligibilityRules ──────────────────────────────────────────────────
        modelBuilder.Entity<EligibilityRule>(e =>
        {
            e.HasKey(r => r.RuleId);
            e.Property(r => r.RuleName).HasMaxLength(150).IsRequired();
            e.HasOne(r => r.Hostel)
                .WithMany(h => h.EligibilityRules)
                .HasForeignKey(r => r.HostelId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EligibilityRuleValue>(e =>
        {
            e.HasKey(v => v.ValueId);
            e.Property(v => v.FieldName).HasMaxLength(100).IsRequired();
            e.Property(v => v.Operator).HasMaxLength(10).IsRequired();
            e.Property(v => v.Value).HasMaxLength(255).IsRequired();
            e.HasOne(v => v.Rule)
                .WithMany(r => r.Values)
                .HasForeignKey(v => v.RuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Blocks / Floors / Rooms / Beds ────────────────────────────────────
        modelBuilder.Entity<Block>(e =>
        {
            e.HasKey(b => b.BlockId);
            e.Property(b => b.BlockName).HasMaxLength(50).IsRequired();
            e.HasOne(b => b.Hostel)
                .WithMany(h => h.Blocks)
                .HasForeignKey(b => b.HostelId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Floor>(e =>
        {
            e.HasKey(f => f.FloorId);
            e.HasOne(f => f.Block)
                .WithMany(b => b.Floors)
                .HasForeignKey(f => f.BlockId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(f => new { f.BlockId, f.FloorNumber }).IsUnique();
        });

        modelBuilder.Entity<Room>(e =>
        {
            e.HasKey(r => r.RoomId);
            e.Property(r => r.RoomNumber).HasMaxLength(20).IsRequired();
            e.Property(r => r.RoomType).HasConversion<string>().HasMaxLength(10);
            e.HasOne(r => r.Floor)
                .WithMany(f => f.Rooms)
                .HasForeignKey(r => r.FloorId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(r => new { r.FloorId, r.RoomNumber }).IsUnique();
        });

        modelBuilder.Entity<Bed>(e =>
        {
            e.HasKey(b => b.BedId);
            e.Property(b => b.BedLabel).HasMaxLength(10).IsRequired();
            e.HasOne(b => b.Room)
                .WithMany(r => r.Beds)
                .HasForeignKey(b => b.RoomId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(b => new { b.RoomId, b.BedLabel }).IsUnique();
        });

        // ── Applications ──────────────────────────────────────────────────────
        // BUSINESS RULE: One active application per student per academic year
        // Enforced via UNIQUE(StudentId, AcademicYearId)
        modelBuilder.Entity<Domain.Entities.Application>(e =>
        {
            e.HasKey(a => a.ApplicationId);
            e.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);
            e.HasOne(a => a.Student)
                .WithMany(s => s.Applications)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.AcademicYear)
                .WithMany(y => y.Applications)
                .HasForeignKey(a => a.AcademicYearId)
                .OnDelete(DeleteBehavior.Restrict);
            // DB-level constraint: one application row per student per year
            e.HasIndex(a => new { a.StudentId, a.AcademicYearId }).IsUnique();
            e.HasIndex(a => a.Status);
        });

        // ── ApplicationHostelPreferences ─────────────────────────────────────
        modelBuilder.Entity<ApplicationHostelPreference>(e =>
        {
            e.HasKey(p => p.PrefId);
            e.HasOne(p => p.Application)
                .WithMany(a => a.Preferences)
                .HasForeignKey(p => p.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(p => p.Hostel)
                .WithMany(h => h.Preferences)
                .HasForeignKey(p => p.HostelId)
                .OnDelete(DeleteBehavior.Restrict);
            // One hostel choice per application (no duplicate hostel preferences)
            e.HasIndex(p => new { p.ApplicationId, p.HostelId }).IsUnique();
        });

        // ── ApplicationStatusHistory ──────────────────────────────────────────
        modelBuilder.Entity<ApplicationStatusHistory>(e =>
        {
            e.HasKey(h => h.HistoryId);
            e.Property(h => h.OldStatus).HasConversion<string>().HasMaxLength(20);
            e.Property(h => h.NewStatus).HasConversion<string>().HasMaxLength(20);
            e.HasOne(h => h.Application)
                .WithMany(a => a.StatusHistory)
                .HasForeignKey(h => h.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(h => h.ApplicationId);
        });

        // ── MeritResults ──────────────────────────────────────────────────────
        modelBuilder.Entity<MeritResult>(e =>
        {
            e.HasKey(m => m.MeritId);
            e.Property(m => m.MeritScore).HasPrecision(8, 4);
            e.Property(m => m.Cpn).HasPrecision(6, 2);
            e.Property(m => m.Cgpa).HasPrecision(4, 2);
            e.Property(m => m.AllocationStatus).HasConversion<string>().HasMaxLength(20);
            e.Property(m => m.Department).HasMaxLength(150);
            e.Property(m => m.Program).HasMaxLength(150);
            e.Property(m => m.AcademicYear).HasMaxLength(20);
            e.Property(m => m.District).HasMaxLength(100);
            e.Property(m => m.Gender).HasMaxLength(10);
            e.Property(m => m.RollNumber).HasMaxLength(50);
            e.Property(m => m.AllocatedHostel).HasMaxLength(150);
            e.Property(m => m.AllocatedRoom).HasMaxLength(20);
            e.Property(m => m.AllocatedBed).HasMaxLength(10);
            e.HasOne(m => m.Application)
                .WithOne(a => a.MeritResult)
                .HasForeignKey<MeritResult>(m => m.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(m => m.Cycle)
                .WithMany(c => c.MeritResults)
                .HasForeignKey(m => m.CycleId)
                .OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(m => new { m.ApplicationId, m.CycleId });
            e.HasIndex(m => m.MeritRank);
        });

        // ── AllocationCycles ──────────────────────────────────────────────────
        modelBuilder.Entity<AllocationCycle>(e =>
        {
            e.HasKey(c => c.CycleId);
            e.Property(c => c.Status).HasMaxLength(20).IsRequired();
            e.Property(c => c.Remarks).HasMaxLength(500);
            e.HasOne(c => c.AcademicYear)
                .WithMany()
                .HasForeignKey(c => c.AcademicYearId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(c => c.RunAt);
        });

        // ── MeritWeightConfigs ────────────────────────────────────────────────
        modelBuilder.Entity<MeritWeightConfig>(e =>
        {
            e.HasKey(w => w.ConfigId);
            e.Property(w => w.CpnWeight).HasPrecision(5, 4);
            e.Property(w => w.CgpaWeight).HasPrecision(5, 4);
            e.Property(w => w.Notes).HasMaxLength(500);
            e.HasOne(w => w.AcademicYear)
                .WithMany()
                .HasForeignKey(w => w.AcademicYearId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── DistrictSeatRules ─────────────────────────────────────────────────
        modelBuilder.Entity<DistrictSeatRule>(e =>
        {
            e.HasKey(d => d.RuleId);
            e.HasOne(d => d.AcademicYear)
                .WithMany()
                .HasForeignKey(d => d.AcademicYearId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(d => d.District)
                .WithMany()
                .HasForeignKey(d => d.DistrictId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(d => d.Hostel)
                .WithMany()
                .HasForeignKey(d => d.HostelId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── Allocations ───────────────────────────────────────────────────────
        // BUSINESS RULE #3: One active allocation per student  → UNIQUE(StudentId, IsActive)
        // BUSINESS RULE #4: One active allocation per bed      → UNIQUE(BedId, IsActive)
        // MySQL pattern: composite unique with IsActive flag allows multiple inactive rows
        modelBuilder.Entity<Allocation>(e =>
        {
            e.HasKey(a => a.AllocationId);
            e.HasOne(a => a.Application)
                .WithMany(ap => ap.Allocations)
                .HasForeignKey(a => a.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.Student)
                .WithMany(s => s.Allocations)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.Bed)
                .WithMany(b => b.Allocations)
                .HasForeignKey(a => a.BedId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.Cycle)
                .WithMany(c => c.Allocations)
                .HasForeignKey(a => a.CycleId)
                .OnDelete(DeleteBehavior.SetNull);
            // One active allocation per student
            e.HasIndex(a => new { a.StudentId, a.IsActive }).IsUnique();
            // One active allocation per bed
            e.HasIndex(a => new { a.BedId, a.IsActive }).IsUnique();
        });

        // ── Residents ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Resident>(e =>
        {
            e.HasKey(r => r.ResidentId);
            e.HasOne(r => r.Allocation)
                .WithOne(a => a.Resident)
                .HasForeignKey<Resident>(r => r.AllocationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── ProcessingFees ────────────────────────────────────────────────────
        // BUSINESS RULE #2: One processing fee per application → UNIQUE(ApplicationId)
        modelBuilder.Entity<ProcessingFee>(e =>
        {
            e.HasKey(f => f.FeeId);
            e.Property(f => f.Amount).HasPrecision(10, 2);
            e.Property(f => f.Status).HasConversion<string>().HasMaxLength(10);
            e.HasOne(f => f.Application)
                .WithOne(a => a.ProcessingFee)
                .HasForeignKey<ProcessingFee>(f => f.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);
            // Enforces one fee per application at DB level
            e.HasIndex(f => f.ApplicationId).IsUnique();
        });

        // ── Challans ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Challan>(e =>
        {
            e.HasKey(c => c.ChallanId);
            e.Property(c => c.ChallanNumber).HasMaxLength(50).IsRequired();
            e.HasIndex(c => c.ChallanNumber).IsUnique();
            e.HasOne(c => c.Fee)
                .WithMany(f => f.Challans)
                .HasForeignKey(c => c.FeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Payments ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Payment>(e =>
        {
            e.HasKey(p => p.PaymentId);
            e.Property(p => p.Amount).HasPrecision(10, 2);
            e.Property(p => p.TransactionRef).HasMaxLength(100).IsRequired();
            e.HasIndex(p => p.TransactionRef).IsUnique();
            e.Property(p => p.PaymentMethod).HasMaxLength(50);
            e.HasOne(p => p.Challan)
                .WithMany(c => c.Payments)
                .HasForeignKey(p => p.ChallanId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── RoomChangeRequests ────────────────────────────────────────────────
        modelBuilder.Entity<RoomChangeRequest>(e =>
        {
            e.HasKey(r => r.RequestId);
            e.Property(r => r.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(r => r.Reason).HasMaxLength(1000);
            e.HasOne(r => r.Resident)
                .WithMany(res => res.RoomChangeRequests)
                .HasForeignKey(r => r.ResidentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.RequestedRoom)
                .WithMany()
                .HasForeignKey(r => r.RequestedRoomId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── Complaints ────────────────────────────────────────────────────────
        modelBuilder.Entity<Complaint>(e =>
        {
            e.HasKey(c => c.ComplaintId);
            e.Property(c => c.Category).HasConversion<string>().HasMaxLength(20);
            e.Property(c => c.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(c => c.Description).HasMaxLength(2000);
            e.HasOne(c => c.Resident)
                .WithMany(r => r.Complaints)
                .HasForeignKey(c => c.ResidentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(c => c.Status);
        });

        modelBuilder.Entity<ComplaintAttachment>(e =>
        {
            e.HasKey(a => a.AttachmentId);
            e.Property(a => a.FileUrl).HasMaxLength(500).IsRequired();
            e.Property(a => a.FileType).HasMaxLength(50);
            e.HasOne(a => a.Complaint)
                .WithMany(c => c.Attachments)
                .HasForeignKey(a => a.ComplaintId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Notifications ─────────────────────────────────────────────────────
        modelBuilder.Entity<Notification>(e =>
        {
            e.HasKey(n => n.NotificationId);
            e.Property(n => n.Title).HasMaxLength(200).IsRequired();
            e.Property(n => n.Message).HasMaxLength(2000).IsRequired();
            e.Property(n => n.Link).HasMaxLength(500);
            e.HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(n => new { n.UserId, n.IsRead });
        });

        // ── Announcements ─────────────────────────────────────────────────────
        modelBuilder.Entity<Announcement>(e =>
        {
            e.HasKey(a => a.AnnouncementId);
            e.Property(a => a.Title).HasMaxLength(300).IsRequired();
            e.Property(a => a.TargetAudience).HasMaxLength(50);
            e.HasOne(a => a.Admin)
                .WithMany(ad => ad.Announcements)
                .HasForeignKey(a => a.AdminId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(a => new { a.IsPublished, a.PublishedAt });
        });

        // ── Reviews ───────────────────────────────────────────────────────────
        // BUSINESS RULE: One review per resident per hostel → UNIQUE(ResidentId, HostelId)
        modelBuilder.Entity<Review>(e =>
        {
            e.HasKey(r => r.ReviewId);
            e.Property(r => r.Comment).HasMaxLength(2000);
            e.HasOne(r => r.Resident)
                .WithMany(res => res.Reviews)
                .HasForeignKey(r => r.ResidentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.Hostel)
                .WithMany(h => h.Reviews)
                .HasForeignKey(r => r.HostelId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(r => new { r.ResidentId, r.HostelId }).IsUnique();
        });

        modelBuilder.Entity<ReviewRating>(e =>
        {
            e.HasKey(r => r.RatingId);
            e.Property(r => r.Category).HasMaxLength(50).IsRequired();
            e.HasOne(r => r.Review)
                .WithMany(rv => rv.Ratings)
                .HasForeignKey(r => r.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── AuditLogs ─────────────────────────────────────────────────────────
        modelBuilder.Entity<AuditLog>(e =>
        {
            e.HasKey(l => l.LogId);
            e.Property(l => l.LogId).ValueGeneratedOnAdd();
            e.Property(l => l.TableName).HasMaxLength(100).IsRequired();
            e.Property(l => l.RecordId).HasMaxLength(50).IsRequired();
            e.Property(l => l.Action).HasConversion<string>().HasMaxLength(10);
            e.Property(l => l.OldValues).HasColumnType("JSON");
            e.Property(l => l.NewValues).HasColumnType("JSON");
            e.Property(l => l.IpAddress).HasMaxLength(45);
            e.HasOne(l => l.PerformedBy)
                .WithMany(u => u.AuditLogs)
                .HasForeignKey(l => l.PerformedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(l => new { l.TableName, l.RecordId });
            e.HasIndex(l => l.PerformedAt);
        });
    }

    // ── Automatic UpdatedAt management ────────────────────────────────────────
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        SetTimestamps();
        return base.SaveChanges();
    }

    private void SetTimestamps()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = now;
            if (entry.State is EntityState.Added or EntityState.Modified)
                entry.Entity.UpdatedAt = now;
        }
    }
}
