CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;
DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    ALTER DATABASE CHARACTER SET utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `AcademicYears` (
        `AcademicYearId` int NOT NULL AUTO_INCREMENT,
        `Label` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `StartDate` date NOT NULL,
        `EndDate` date NOT NULL,
        `IsActive` tinyint(1) NOT NULL,
        `ApplicationOpenDate` datetime(6) NULL,
        `ApplicationCloseDate` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_AcademicYears` PRIMARY KEY (`AcademicYearId`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Departments` (
        `DepartmentId` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `Code` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Departments` PRIMARY KEY (`DepartmentId`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Districts` (
        `DistrictId` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Province` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Districts` PRIMARY KEY (`DistrictId`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Hostels` (
        `HostelId` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `Gender` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `TotalCapacity` int NOT NULL,
        `Address` longtext CHARACTER SET utf8mb4 NULL,
        `Description` longtext CHARACTER SET utf8mb4 NULL,
        `Warden` varchar(150) CHARACTER SET utf8mb4 NULL,
        `WardenPhone` varchar(20) CHARACTER SET utf8mb4 NULL,
        `IsActive` tinyint(1) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedAt` datetime(6) NULL,
        CONSTRAINT `PK_Hostels` PRIMARY KEY (`HostelId`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Users` (
        `UserId` int NOT NULL AUTO_INCREMENT,
        `Email` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
        `PasswordHash` varchar(512) CHARACTER SET utf8mb4 NOT NULL,
        `FirstName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `LastName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Role` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `IsActive` tinyint(1) NOT NULL,
        `PhoneNumber` varchar(20) CHARACTER SET utf8mb4 NULL,
        `LastLoginAt` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedAt` datetime(6) NULL,
        CONSTRAINT `PK_Users` PRIMARY KEY (`UserId`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Programs` (
        `ProgramId` int NOT NULL AUTO_INCREMENT,
        `DepartmentId` int NOT NULL,
        `Name` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `Code` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `DegreeType` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `TotalSemesters` int NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Programs` PRIMARY KEY (`ProgramId`),
        CONSTRAINT `FK_Programs_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`DepartmentId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Blocks` (
        `BlockId` int NOT NULL AUTO_INCREMENT,
        `HostelId` int NOT NULL,
        `BlockName` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Blocks` PRIMARY KEY (`BlockId`),
        CONSTRAINT `FK_Blocks_Hostels_HostelId` FOREIGN KEY (`HostelId`) REFERENCES `Hostels` (`HostelId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `EligibilityRules` (
        `RuleId` int NOT NULL AUTO_INCREMENT,
        `HostelId` int NOT NULL,
        `RuleName` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
        `Description` longtext CHARACTER SET utf8mb4 NULL,
        `IsActive` tinyint(1) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_EligibilityRules` PRIMARY KEY (`RuleId`),
        CONSTRAINT `FK_EligibilityRules_Hostels_HostelId` FOREIGN KEY (`HostelId`) REFERENCES `Hostels` (`HostelId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `HostelAmenities` (
        `AmenityId` int NOT NULL AUTO_INCREMENT,
        `HostelId` int NOT NULL,
        `AmenityName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Description` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_HostelAmenities` PRIMARY KEY (`AmenityId`),
        CONSTRAINT `FK_HostelAmenities_Hostels_HostelId` FOREIGN KEY (`HostelId`) REFERENCES `Hostels` (`HostelId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `HostelImages` (
        `ImageId` int NOT NULL AUTO_INCREMENT,
        `HostelId` int NOT NULL,
        `ImageUrl` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
        `IsPrimary` tinyint(1) NOT NULL,
        `Caption` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_HostelImages` PRIMARY KEY (`ImageId`),
        CONSTRAINT `FK_HostelImages_Hostels_HostelId` FOREIGN KEY (`HostelId`) REFERENCES `Hostels` (`HostelId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Admins` (
        `AdminId` int NOT NULL AUTO_INCREMENT,
        `UserId` int NOT NULL,
        `EmployeeId` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `Department` varchar(100) CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Admins` PRIMARY KEY (`AdminId`),
        CONSTRAINT `FK_Admins_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `AuditLogs` (
        `LogId` bigint NOT NULL AUTO_INCREMENT,
        `TableName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `RecordId` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `Action` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `OldValues` JSON NULL,
        `NewValues` JSON NULL,
        `PerformedByUserId` int NULL,
        `PerformedAt` datetime(6) NOT NULL,
        `IpAddress` varchar(45) CHARACTER SET utf8mb4 NULL,
        `UserAgent` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_AuditLogs` PRIMARY KEY (`LogId`),
        CONSTRAINT `FK_AuditLogs_Users_PerformedByUserId` FOREIGN KEY (`PerformedByUserId`) REFERENCES `Users` (`UserId`) ON DELETE SET NULL
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Notifications` (
        `NotificationId` int NOT NULL AUTO_INCREMENT,
        `UserId` int NOT NULL,
        `Title` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
        `Message` varchar(2000) CHARACTER SET utf8mb4 NOT NULL,
        `IsRead` tinyint(1) NOT NULL,
        `Link` varchar(500) CHARACTER SET utf8mb4 NULL,
        `SentAt` datetime(6) NOT NULL,
        `ReadAt` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Notifications` PRIMARY KEY (`NotificationId`),
        CONSTRAINT `FK_Notifications_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Students` (
        `StudentId` int NOT NULL AUTO_INCREMENT,
        `UserId` int NOT NULL,
        `RegistrationNumber` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `Cnic` varchar(13) CHARACTER SET utf8mb4 NOT NULL,
        `Gender` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `DateOfBirth` date NOT NULL,
        `DistrictId` int NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedAt` datetime(6) NULL,
        CONSTRAINT `PK_Students` PRIMARY KEY (`StudentId`),
        CONSTRAINT `FK_Students_Districts_DistrictId` FOREIGN KEY (`DistrictId`) REFERENCES `Districts` (`DistrictId`) ON DELETE SET NULL,
        CONSTRAINT `FK_Students_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Floors` (
        `FloorId` int NOT NULL AUTO_INCREMENT,
        `BlockId` int NOT NULL,
        `FloorNumber` int NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Floors` PRIMARY KEY (`FloorId`),
        CONSTRAINT `FK_Floors_Blocks_BlockId` FOREIGN KEY (`BlockId`) REFERENCES `Blocks` (`BlockId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `EligibilityRuleValues` (
        `ValueId` int NOT NULL AUTO_INCREMENT,
        `RuleId` int NOT NULL,
        `FieldName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `Operator` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `Value` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_EligibilityRuleValues` PRIMARY KEY (`ValueId`),
        CONSTRAINT `FK_EligibilityRuleValues_EligibilityRules_RuleId` FOREIGN KEY (`RuleId`) REFERENCES `EligibilityRules` (`RuleId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Announcements` (
        `AnnouncementId` int NOT NULL AUTO_INCREMENT,
        `AdminId` int NOT NULL,
        `Title` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
        `Content` longtext CHARACTER SET utf8mb4 NOT NULL,
        `IsPublished` tinyint(1) NOT NULL,
        `PublishedAt` datetime(6) NULL,
        `ExpiresAt` datetime(6) NULL,
        `TargetAudience` varchar(50) CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Announcements` PRIMARY KEY (`AnnouncementId`),
        CONSTRAINT `FK_Announcements_Admins_AdminId` FOREIGN KEY (`AdminId`) REFERENCES `Admins` (`AdminId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Applications` (
        `ApplicationId` int NOT NULL AUTO_INCREMENT,
        `StudentId` int NOT NULL,
        `AcademicYearId` int NOT NULL,
        `Status` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `SubmittedAt` datetime(6) NULL,
        `Remarks` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Applications` PRIMARY KEY (`ApplicationId`),
        CONSTRAINT `FK_Applications_AcademicYears_AcademicYearId` FOREIGN KEY (`AcademicYearId`) REFERENCES `AcademicYears` (`AcademicYearId`) ON DELETE RESTRICT,
        CONSTRAINT `FK_Applications_Students_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`StudentId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `StudentProfiles` (
        `ProfileId` int NOT NULL AUTO_INCREMENT,
        `StudentId` int NOT NULL,
        `PhotoUrl` longtext CHARACTER SET utf8mb4 NULL,
        `GuardianName` varchar(150) CHARACTER SET utf8mb4 NULL,
        `GuardianPhone` varchar(20) CHARACTER SET utf8mb4 NULL,
        `GuardianRelation` longtext CHARACTER SET utf8mb4 NULL,
        `HomeAddress` longtext CHARACTER SET utf8mb4 NULL,
        `City` longtext CHARACTER SET utf8mb4 NULL,
        `EmergencyContact` longtext CHARACTER SET utf8mb4 NULL,
        `BloodGroup` varchar(5) CHARACTER SET utf8mb4 NULL,
        `Disabilities` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_StudentProfiles` PRIMARY KEY (`ProfileId`),
        CONSTRAINT `FK_StudentProfiles_Students_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`StudentId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `UniversityStudentRecords` (
        `RecordId` int NOT NULL AUTO_INCREMENT,
        `StudentId` int NOT NULL,
        `ProgramId` int NULL,
        `DepartmentId` int NULL,
        `Semester` int NOT NULL,
        `Cgpa` decimal(4,2) NOT NULL,
        `IsVerified` tinyint(1) NOT NULL,
        `VerifiedAt` datetime(6) NULL,
        `VerifiedBy` longtext CHARACTER SET utf8mb4 NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_UniversityStudentRecords` PRIMARY KEY (`RecordId`),
        CONSTRAINT `FK_UniversityStudentRecords_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`DepartmentId`) ON DELETE SET NULL,
        CONSTRAINT `FK_UniversityStudentRecords_Programs_ProgramId` FOREIGN KEY (`ProgramId`) REFERENCES `Programs` (`ProgramId`) ON DELETE SET NULL,
        CONSTRAINT `FK_UniversityStudentRecords_Students_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`StudentId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Rooms` (
        `RoomId` int NOT NULL AUTO_INCREMENT,
        `FloorId` int NOT NULL,
        `RoomNumber` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `RoomType` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `MaxOccupancy` int NOT NULL,
        `Description` longtext CHARACTER SET utf8mb4 NULL,
        `IsUnderMaintenance` tinyint(1) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedAt` datetime(6) NULL,
        CONSTRAINT `PK_Rooms` PRIMARY KEY (`RoomId`),
        CONSTRAINT `FK_Rooms_Floors_FloorId` FOREIGN KEY (`FloorId`) REFERENCES `Floors` (`FloorId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `ApplicationHostelPreferences` (
        `PrefId` int NOT NULL AUTO_INCREMENT,
        `ApplicationId` int NOT NULL,
        `HostelId` int NOT NULL,
        `PreferenceOrder` int NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_ApplicationHostelPreferences` PRIMARY KEY (`PrefId`),
        CONSTRAINT `FK_ApplicationHostelPreferences_Applications_ApplicationId` FOREIGN KEY (`ApplicationId`) REFERENCES `Applications` (`ApplicationId`) ON DELETE CASCADE,
        CONSTRAINT `FK_ApplicationHostelPreferences_Hostels_HostelId` FOREIGN KEY (`HostelId`) REFERENCES `Hostels` (`HostelId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `ApplicationStatusHistories` (
        `HistoryId` int NOT NULL AUTO_INCREMENT,
        `ApplicationId` int NOT NULL,
        `OldStatus` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `NewStatus` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `Remarks` longtext CHARACTER SET utf8mb4 NULL,
        `ChangedByUserId` int NULL,
        `ChangedAt` datetime(6) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_ApplicationStatusHistories` PRIMARY KEY (`HistoryId`),
        CONSTRAINT `FK_ApplicationStatusHistories_Applications_ApplicationId` FOREIGN KEY (`ApplicationId`) REFERENCES `Applications` (`ApplicationId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `MeritResults` (
        `MeritId` int NOT NULL AUTO_INCREMENT,
        `ApplicationId` int NOT NULL,
        `MeritScore` decimal(8,4) NOT NULL,
        `MeritRank` int NOT NULL,
        `IsFinalized` tinyint(1) NOT NULL,
        `FinalizedAt` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_MeritResults` PRIMARY KEY (`MeritId`),
        CONSTRAINT `FK_MeritResults_Applications_ApplicationId` FOREIGN KEY (`ApplicationId`) REFERENCES `Applications` (`ApplicationId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `ProcessingFees` (
        `FeeId` int NOT NULL AUTO_INCREMENT,
        `ApplicationId` int NOT NULL,
        `Amount` decimal(10,2) NOT NULL,
        `DueDate` date NOT NULL,
        `Status` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_ProcessingFees` PRIMARY KEY (`FeeId`),
        CONSTRAINT `FK_ProcessingFees_Applications_ApplicationId` FOREIGN KEY (`ApplicationId`) REFERENCES `Applications` (`ApplicationId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Beds` (
        `BedId` int NOT NULL AUTO_INCREMENT,
        `RoomId` int NOT NULL,
        `BedLabel` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
        `IsAvailable` tinyint(1) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedAt` datetime(6) NULL,
        CONSTRAINT `PK_Beds` PRIMARY KEY (`BedId`),
        CONSTRAINT `FK_Beds_Rooms_RoomId` FOREIGN KEY (`RoomId`) REFERENCES `Rooms` (`RoomId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Challans` (
        `ChallanId` int NOT NULL AUTO_INCREMENT,
        `FeeId` int NOT NULL,
        `ChallanNumber` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `GeneratedAt` datetime(6) NOT NULL,
        `ExpiresAt` datetime(6) NOT NULL,
        `IsExpired` tinyint(1) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Challans` PRIMARY KEY (`ChallanId`),
        CONSTRAINT `FK_Challans_ProcessingFees_FeeId` FOREIGN KEY (`FeeId`) REFERENCES `ProcessingFees` (`FeeId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Allocations` (
        `AllocationId` int NOT NULL AUTO_INCREMENT,
        `ApplicationId` int NOT NULL,
        `StudentId` int NOT NULL,
        `BedId` int NOT NULL,
        `IsActive` tinyint(1) NOT NULL,
        `AllocatedAt` datetime(6) NOT NULL,
        `DeactivatedAt` datetime(6) NULL,
        `AllocatedByAdminId` int NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedAt` datetime(6) NULL,
        CONSTRAINT `PK_Allocations` PRIMARY KEY (`AllocationId`),
        CONSTRAINT `FK_Allocations_Applications_ApplicationId` FOREIGN KEY (`ApplicationId`) REFERENCES `Applications` (`ApplicationId`) ON DELETE RESTRICT,
        CONSTRAINT `FK_Allocations_Beds_BedId` FOREIGN KEY (`BedId`) REFERENCES `Beds` (`BedId`) ON DELETE RESTRICT,
        CONSTRAINT `FK_Allocations_Students_StudentId` FOREIGN KEY (`StudentId`) REFERENCES `Students` (`StudentId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Payments` (
        `PaymentId` int NOT NULL AUTO_INCREMENT,
        `ChallanId` int NOT NULL,
        `Amount` decimal(10,2) NOT NULL,
        `PaidAt` datetime(6) NOT NULL,
        `TransactionRef` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
        `PaymentMethod` varchar(50) CHARACTER SET utf8mb4 NULL,
        `VerifiedByAdminId` int NULL,
        `VerifiedAt` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Payments` PRIMARY KEY (`PaymentId`),
        CONSTRAINT `FK_Payments_Challans_ChallanId` FOREIGN KEY (`ChallanId`) REFERENCES `Challans` (`ChallanId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Residents` (
        `ResidentId` int NOT NULL AUTO_INCREMENT,
        `AllocationId` int NOT NULL,
        `CheckInDate` date NOT NULL,
        `CheckOutDate` date NULL,
        `IsCurrentResident` tinyint(1) NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Residents` PRIMARY KEY (`ResidentId`),
        CONSTRAINT `FK_Residents_Allocations_AllocationId` FOREIGN KEY (`AllocationId`) REFERENCES `Allocations` (`AllocationId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Complaints` (
        `ComplaintId` int NOT NULL AUTO_INCREMENT,
        `ResidentId` int NOT NULL,
        `Category` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `Description` varchar(2000) CHARACTER SET utf8mb4 NOT NULL,
        `Status` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `AssignedToAdminId` int NULL,
        `Resolution` longtext CHARACTER SET utf8mb4 NULL,
        `ResolvedAt` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedAt` datetime(6) NULL,
        CONSTRAINT `PK_Complaints` PRIMARY KEY (`ComplaintId`),
        CONSTRAINT `FK_Complaints_Residents_ResidentId` FOREIGN KEY (`ResidentId`) REFERENCES `Residents` (`ResidentId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `Reviews` (
        `ReviewId` int NOT NULL AUTO_INCREMENT,
        `ResidentId` int NOT NULL,
        `HostelId` int NOT NULL,
        `OverallRating` int NOT NULL,
        `Comment` varchar(2000) CHARACTER SET utf8mb4 NULL,
        `IsApproved` tinyint(1) NOT NULL,
        `ApprovedAt` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_Reviews` PRIMARY KEY (`ReviewId`),
        CONSTRAINT `FK_Reviews_Hostels_HostelId` FOREIGN KEY (`HostelId`) REFERENCES `Hostels` (`HostelId`) ON DELETE RESTRICT,
        CONSTRAINT `FK_Reviews_Residents_ResidentId` FOREIGN KEY (`ResidentId`) REFERENCES `Residents` (`ResidentId`) ON DELETE RESTRICT
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `RoomChangeRequests` (
        `RequestId` int NOT NULL AUTO_INCREMENT,
        `ResidentId` int NOT NULL,
        `RequestedRoomId` int NULL,
        `Reason` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
        `Status` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
        `ReviewedByAdminId` int NULL,
        `AdminRemarks` longtext CHARACTER SET utf8mb4 NULL,
        `ReviewedAt` datetime(6) NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_RoomChangeRequests` PRIMARY KEY (`RequestId`),
        CONSTRAINT `FK_RoomChangeRequests_Residents_ResidentId` FOREIGN KEY (`ResidentId`) REFERENCES `Residents` (`ResidentId`) ON DELETE RESTRICT,
        CONSTRAINT `FK_RoomChangeRequests_Rooms_RequestedRoomId` FOREIGN KEY (`RequestedRoomId`) REFERENCES `Rooms` (`RoomId`) ON DELETE SET NULL
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `ComplaintAttachments` (
        `AttachmentId` int NOT NULL AUTO_INCREMENT,
        `ComplaintId` int NOT NULL,
        `FileUrl` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
        `FileType` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `FileSizeBytes` bigint NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_ComplaintAttachments` PRIMARY KEY (`AttachmentId`),
        CONSTRAINT `FK_ComplaintAttachments_Complaints_ComplaintId` FOREIGN KEY (`ComplaintId`) REFERENCES `Complaints` (`ComplaintId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE TABLE `ReviewRatings` (
        `RatingId` int NOT NULL AUTO_INCREMENT,
        `ReviewId` int NOT NULL,
        `Category` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
        `Score` int NOT NULL,
        `CreatedAt` datetime(6) NOT NULL,
        `UpdatedAt` datetime(6) NOT NULL,
        CONSTRAINT `PK_ReviewRatings` PRIMARY KEY (`RatingId`),
        CONSTRAINT `FK_ReviewRatings_Reviews_ReviewId` FOREIGN KEY (`ReviewId`) REFERENCES `Reviews` (`ReviewId`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_AcademicYears_Label` ON `AcademicYears` (`Label`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Admins_EmployeeId` ON `Admins` (`EmployeeId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Admins_UserId` ON `Admins` (`UserId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Allocations_ApplicationId` ON `Allocations` (`ApplicationId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Allocations_BedId_IsActive` ON `Allocations` (`BedId`, `IsActive`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Allocations_StudentId_IsActive` ON `Allocations` (`StudentId`, `IsActive`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Announcements_AdminId` ON `Announcements` (`AdminId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Announcements_IsPublished_PublishedAt` ON `Announcements` (`IsPublished`, `PublishedAt`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_ApplicationHostelPreferences_ApplicationId_HostelId` ON `ApplicationHostelPreferences` (`ApplicationId`, `HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_ApplicationHostelPreferences_HostelId` ON `ApplicationHostelPreferences` (`HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Applications_AcademicYearId` ON `Applications` (`AcademicYearId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Applications_Status` ON `Applications` (`Status`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Applications_StudentId_AcademicYearId` ON `Applications` (`StudentId`, `AcademicYearId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_ApplicationStatusHistories_ApplicationId` ON `ApplicationStatusHistories` (`ApplicationId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_AuditLogs_PerformedAt` ON `AuditLogs` (`PerformedAt`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_AuditLogs_PerformedByUserId` ON `AuditLogs` (`PerformedByUserId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_AuditLogs_TableName_RecordId` ON `AuditLogs` (`TableName`, `RecordId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Beds_RoomId_BedLabel` ON `Beds` (`RoomId`, `BedLabel`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Blocks_HostelId` ON `Blocks` (`HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Challans_ChallanNumber` ON `Challans` (`ChallanNumber`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Challans_FeeId` ON `Challans` (`FeeId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_ComplaintAttachments_ComplaintId` ON `ComplaintAttachments` (`ComplaintId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Complaints_ResidentId` ON `Complaints` (`ResidentId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Complaints_Status` ON `Complaints` (`Status`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Departments_Code` ON `Departments` (`Code`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Districts_Name` ON `Districts` (`Name`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_EligibilityRules_HostelId` ON `EligibilityRules` (`HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_EligibilityRuleValues_RuleId` ON `EligibilityRuleValues` (`RuleId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Floors_BlockId_FloorNumber` ON `Floors` (`BlockId`, `FloorNumber`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_HostelAmenities_HostelId` ON `HostelAmenities` (`HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_HostelImages_HostelId` ON `HostelImages` (`HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_MeritResults_ApplicationId` ON `MeritResults` (`ApplicationId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Notifications_UserId_IsRead` ON `Notifications` (`UserId`, `IsRead`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Payments_ChallanId` ON `Payments` (`ChallanId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Payments_TransactionRef` ON `Payments` (`TransactionRef`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_ProcessingFees_ApplicationId` ON `ProcessingFees` (`ApplicationId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Programs_Code` ON `Programs` (`Code`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Programs_DepartmentId` ON `Programs` (`DepartmentId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Residents_AllocationId` ON `Residents` (`AllocationId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_ReviewRatings_ReviewId` ON `ReviewRatings` (`ReviewId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Reviews_HostelId` ON `Reviews` (`HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Reviews_ResidentId_HostelId` ON `Reviews` (`ResidentId`, `HostelId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_RoomChangeRequests_RequestedRoomId` ON `RoomChangeRequests` (`RequestedRoomId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_RoomChangeRequests_ResidentId` ON `RoomChangeRequests` (`ResidentId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Rooms_FloorId_RoomNumber` ON `Rooms` (`FloorId`, `RoomNumber`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_StudentProfiles_StudentId` ON `StudentProfiles` (`StudentId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Students_Cnic` ON `Students` (`Cnic`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_Students_DistrictId` ON `Students` (`DistrictId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Students_RegistrationNumber` ON `Students` (`RegistrationNumber`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Students_UserId` ON `Students` (`UserId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_UniversityStudentRecords_DepartmentId` ON `UniversityStudentRecords` (`DepartmentId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE INDEX `IX_UniversityStudentRecords_ProgramId` ON `UniversityStudentRecords` (`ProgramId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_UniversityStudentRecords_StudentId` ON `UniversityStudentRecords` (`StudentId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    CREATE UNIQUE INDEX `IX_Users_Email` ON `Users` (`Email`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260809034601_InitialCreate') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260809034601_InitialCreate', '9.0.0');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

