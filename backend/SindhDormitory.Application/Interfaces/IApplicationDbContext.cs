using Microsoft.EntityFrameworkCore;
using SindhDormitory.Domain.Entities;
using ApplicationEntity = SindhDormitory.Domain.Entities.Application;

namespace SindhDormitory.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User>                          Users                          { get; }
    DbSet<Student>                       Students                       { get; }
    DbSet<StudentProfile>                StudentProfiles                { get; set; }
    DbSet<UniversityStudentRecord>       UniversityStudentRecords       { get; set; }
    DbSet<SimulatedUniversityRecord>    SimulatedUniversityRecords    { get; set; }
    DbSet<Admin>                         Admins                         { get; }
    DbSet<AuditLog>                      AuditLogs                      { get; }

    DbSet<AcademicYear>                  AcademicYears                  { get; }
    DbSet<District>                      Districts                      { get; }
    DbSet<Hostel>                        Hostels                        { get; }
    DbSet<HostelImage>                   HostelImages                   { get; }
    DbSet<HostelAmenity>                 HostelAmenities                { get; }
    DbSet<Block>                         Blocks                         { get; }
    DbSet<Room>                          Rooms                          { get; }
    DbSet<Bed>                           Beds                           { get; }

    DbSet<ApplicationEntity>             Applications                   { get; }
    DbSet<ApplicationHostelPreference>   ApplicationHostelPreferences   { get; }
    DbSet<ProcessingFee>                 ProcessingFees                 { get; }
    DbSet<Challan>                       Challans                       { get; }
    DbSet<MeritResult>                   MeritResults                   { get; }
    DbSet<AllocationCycle>               AllocationCycles               { get; }
    DbSet<MeritWeightConfig>             MeritWeightConfigs             { get; }
    DbSet<DistrictSeatRule>              DistrictSeatRules              { get; }
    DbSet<Allocation>                    Allocations                    { get; }
    DbSet<Notification>                  Notifications                  { get; }
    DbSet<Announcement>                  Announcements                  { get; }
    DbSet<Resident>                      Residents                      { get; }
    DbSet<RoomChangeRequest>             RoomChangeRequests             { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

