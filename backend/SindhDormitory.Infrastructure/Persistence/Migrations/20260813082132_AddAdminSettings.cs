using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SindhDormitory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(6)")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn)
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(6)");

            migrationBuilder.CreateTable(
                name: "AdminSettings",
                columns: table => new
                {
                    SettingsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AllocationOpen = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AllocationDeadline = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    MaxAllocationPerCycle = table.Column<int>(type: "int", nullable: false),
                    AllocationEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminSettings", x => x.SettingsId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 13, 8, 21, 28, 199, DateTimeKind.Utc).AddTicks(5636), new DateTime(2026, 8, 13, 8, 21, 28, 199, DateTimeKind.Utc).AddTicks(5641) });

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 13, 8, 21, 28, 200, DateTimeKind.Utc).AddTicks(1082), new DateTime(2026, 8, 13, 8, 21, 28, 200, DateTimeKind.Utc).AddTicks(1083) });

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 13, 8, 21, 28, 200, DateTimeKind.Utc).AddTicks(1096), new DateTime(2026, 8, 13, 8, 21, 28, 200, DateTimeKind.Utc).AddTicks(1097) });

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 13, 8, 21, 28, 200, DateTimeKind.Utc).AddTicks(1104), new DateTime(2026, 8, 13, 8, 21, 28, 200, DateTimeKind.Utc).AddTicks(1104) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminSettings");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(6)",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "CURRENT_TIMESTAMP")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn)
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(6)",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 10, 7, 24, 0, 312, DateTimeKind.Utc).AddTicks(6411), new DateTime(2026, 8, 10, 7, 24, 0, 312, DateTimeKind.Utc).AddTicks(6416) });

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2256), new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2260) });

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2275), new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2276) });

            migrationBuilder.UpdateData(
                table: "SimulatedUniversityRecords",
                keyColumn: "RecordId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2298), new DateTime(2026, 8, 10, 7, 24, 0, 313, DateTimeKind.Utc).AddTicks(2300) });
        }
    }
}
