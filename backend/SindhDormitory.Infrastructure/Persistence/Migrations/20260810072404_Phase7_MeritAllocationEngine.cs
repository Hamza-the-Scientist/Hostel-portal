using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SindhDormitory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase7_MeritAllocationEngine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalDetails",
                table: "RoomChangeRequests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AttachmentUrl",
                table: "RoomChangeRequests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PreferredBlock",
                table: "RoomChangeRequests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AcademicYear",
                table: "MeritResults",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AllocatedBed",
                table: "MeritResults",
                type: "varchar(10)",
                maxLength: 10,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AllocatedHostel",
                table: "MeritResults",
                type: "varchar(150)",
                maxLength: 150,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "AllocatedHostelId",
                table: "MeritResults",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AllocatedRoom",
                table: "MeritResults",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AllocationStatus",
                table: "MeritResults",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "Cgpa",
                table: "MeritResults",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Cpn",
                table: "MeritResults",
                type: "decimal(6,2)",
                precision: 6,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "CycleId",
                table: "MeritResults",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "MeritResults",
                type: "varchar(150)",
                maxLength: 150,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "MeritResults",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "MeritResults",
                type: "varchar(10)",
                maxLength: 10,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsEligible",
                table: "MeritResults",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Program",
                table: "MeritResults",
                type: "varchar(150)",
                maxLength: 150,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RollNumber",
                table: "MeritResults",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Beds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CycleId",
                table: "Allocations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AllocationCycles",
                columns: table => new
                {
                    CycleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AcademicYearId = table.Column<int>(type: "int", nullable: false),
                    TriggeredByAdminId = table.Column<int>(type: "int", nullable: true),
                    RunAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsSecondRound = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Remarks = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllocationCycles", x => x.CycleId);
                    table.ForeignKey(
                        name: "FK_AllocationCycles_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "AcademicYearId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DistrictSeatRules",
                columns: table => new
                {
                    RuleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AcademicYearId = table.Column<int>(type: "int", nullable: false),
                    DistrictId = table.Column<int>(type: "int", nullable: false),
                    HostelId = table.Column<int>(type: "int", nullable: true),
                    ReservedSeats = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DistrictSeatRules", x => x.RuleId);
                    table.ForeignKey(
                        name: "FK_DistrictSeatRules_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "AcademicYearId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DistrictSeatRules_Districts_DistrictId",
                        column: x => x.DistrictId,
                        principalTable: "Districts",
                        principalColumn: "DistrictId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DistrictSeatRules_Hostels_HostelId",
                        column: x => x.HostelId,
                        principalTable: "Hostels",
                        principalColumn: "HostelId",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MeritWeightConfigs",
                columns: table => new
                {
                    ConfigId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AcademicYearId = table.Column<int>(type: "int", nullable: false),
                    IsFirstYearRule = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CpnWeight = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: false),
                    CgpaWeight = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Notes = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeritWeightConfigs", x => x.ConfigId);
                    table.ForeignKey(
                        name: "FK_MeritWeightConfigs_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "AcademicYearId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SimulatedUniversityRecords",
                columns: table => new
                {
                    RecordId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FullName = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Cnic = table.Column<string>(type: "varchar(13)", maxLength: 13, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RollNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FatherName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DistrictName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Province = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DepartmentName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProgramName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DegreeType = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Semester = table.Column<int>(type: "int", nullable: false),
                    Cgpa = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    Cpn = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    AcademicYear = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gender = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    ProfilePictureUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SimulatedUniversityRecords", x => x.RecordId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "SimulatedUniversityRecords",
                columns: new[] { "RecordId", "AcademicYear", "Address", "Cgpa", "Cnic", "Cpn", "CreatedAt", "DateOfBirth", "DegreeType", "DepartmentName", "DistrictName", "FatherName", "FullName", "Gender", "IsActive", "ProfilePictureUrl", "ProgramName", "Province", "RollNumber", "Semester", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "2025-2026", "House 45, Sector B, Qasimabad", 3.75m, "4120112345671", 168.5m, new DateTime(2026, 8, 10, 7, 24, 0, 312, DateTimeKind.Utc).AddTicks(6411), new DateOnly(2003, 5, 14), "BS", "Computer Science", "Hyderabad", "Ali Nawaz Soomro", "Tariq Ahmed Soomro", "Male", true, "assets/demo-profiles/tariq.jpg", "BS Computer Science", "Sindh", "2K22/CS/101", 5, new DateTime(2026, 8, 10, 7, 24, 0, 312, DateTimeKind.Utc).AddTicks(6416) },
                    { 2, "2025-2026", "Village Bhit Shah, Taluka Matiari", 3.88m, "4130212345672", 174.0m, new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2256), new DateOnly(2003, 8, 22), "BS", "Computer Science", "Matiari", "Syed Ghulam Shah", "Dua Fatima Shah", "Female", true, "assets/demo-profiles/dua.jpg", "BS Computer Science", "Sindh", "2K22/CS/102", 5, new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2260) },
                    { 3, "2025-2026", "Muhalla Station Road, Dadu", 3.42m, "4110112345673", 155.0m, new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2275), new DateOnly(2004, 2, 10), "BS", "Electrical Engineering", "Dadu", "Mohammad Rahim Chandio", "Bilal Khan Chandio", "Male", true, "assets/demo-profiles/bilal.jpg", "BS Electrical Engineering", "Sindh", "2K23/EE/45", 3, new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2276) },
                    { 4, "2025-2026", "Flat 12, Royal Plaza, Sukkur", 3.65m, "4550412345674", 161.5m, new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2298), new DateOnly(2002, 11, 30), "BS", "English Language & Literature", "Sukkur", "Nisar Kalhoro", "Zainab Kalhoro", "Female", true, "assets/demo-profiles/zainab.jpg", "BS English", "Sindh", "2K21/ENG/12", 7, new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2300) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeritResults_ApplicationId_CycleId",
                table: "MeritResults",
                columns: new[] { "ApplicationId", "CycleId" });

            migrationBuilder.CreateIndex(
                name: "IX_MeritResults_CycleId",
                table: "MeritResults",
                column: "CycleId");

            migrationBuilder.CreateIndex(
                name: "IX_MeritResults_MeritRank",
                table: "MeritResults",
                column: "MeritRank");

            migrationBuilder.CreateIndex(
                name: "IX_Allocations_CycleId",
                table: "Allocations",
                column: "CycleId");

            migrationBuilder.CreateIndex(
                name: "IX_AllocationCycles_AcademicYearId",
                table: "AllocationCycles",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_AllocationCycles_RunAt",
                table: "AllocationCycles",
                column: "RunAt");

            migrationBuilder.CreateIndex(
                name: "IX_DistrictSeatRules_AcademicYearId",
                table: "DistrictSeatRules",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_DistrictSeatRules_DistrictId",
                table: "DistrictSeatRules",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_DistrictSeatRules_HostelId",
                table: "DistrictSeatRules",
                column: "HostelId");

            migrationBuilder.CreateIndex(
                name: "IX_MeritWeightConfigs_AcademicYearId",
                table: "MeritWeightConfigs",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_SimulatedUniversityRecords_Cnic",
                table: "SimulatedUniversityRecords",
                column: "Cnic",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SimulatedUniversityRecords_RollNumber",
                table: "SimulatedUniversityRecords",
                column: "RollNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Allocations_AllocationCycles_CycleId",
                table: "Allocations",
                column: "CycleId",
                principalTable: "AllocationCycles",
                principalColumn: "CycleId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_MeritResults_AllocationCycles_CycleId",
                table: "MeritResults",
                column: "CycleId",
                principalTable: "AllocationCycles",
                principalColumn: "CycleId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Allocations_AllocationCycles_CycleId",
                table: "Allocations");

            migrationBuilder.DropForeignKey(
                name: "FK_MeritResults_AllocationCycles_CycleId",
                table: "MeritResults");

            migrationBuilder.DropTable(
                name: "AllocationCycles");

            migrationBuilder.DropTable(
                name: "DistrictSeatRules");

            migrationBuilder.DropTable(
                name: "MeritWeightConfigs");

            migrationBuilder.DropTable(
                name: "SimulatedUniversityRecords");

            migrationBuilder.DropIndex(
                name: "IX_MeritResults_ApplicationId_CycleId",
                table: "MeritResults");

            migrationBuilder.DropIndex(
                name: "IX_MeritResults_CycleId",
                table: "MeritResults");

            migrationBuilder.DropIndex(
                name: "IX_MeritResults_MeritRank",
                table: "MeritResults");

            migrationBuilder.DropIndex(
                name: "IX_Allocations_CycleId",
                table: "Allocations");

            migrationBuilder.DropColumn(
                name: "AdditionalDetails",
                table: "RoomChangeRequests");

            migrationBuilder.DropColumn(
                name: "AttachmentUrl",
                table: "RoomChangeRequests");

            migrationBuilder.DropColumn(
                name: "PreferredBlock",
                table: "RoomChangeRequests");

            migrationBuilder.DropColumn(
                name: "AcademicYear",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "AllocatedBed",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "AllocatedHostel",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "AllocatedHostelId",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "AllocatedRoom",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "AllocationStatus",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "Cgpa",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "Cpn",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "CycleId",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "Department",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "District",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "IsEligible",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "Program",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "RollNumber",
                table: "MeritResults");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Beds");

            migrationBuilder.DropColumn(
                name: "CycleId",
                table: "Allocations");
        }
    }
}
