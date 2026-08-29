"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatedUniversityRecord = void 0;
const typeorm_1 = require("typeorm");
let SimulatedUniversityRecord = class SimulatedUniversityRecord {
};
exports.SimulatedUniversityRecord = SimulatedUniversityRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'RecordId' }),
    __metadata("design:type", Number)
], SimulatedUniversityRecord.prototype, "recordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FullName', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cnic', type: 'varchar', length: 13, unique: true }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "cnic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RollNumber', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "rollNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FatherName', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "fatherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Address', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DistrictName', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "districtName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Province', type: 'varchar', length: 50, default: 'Sindh' }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DepartmentName', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "departmentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ProgramName', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "programName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DegreeType', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "degreeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Semester', type: 'int' }),
    __metadata("design:type", Number)
], SimulatedUniversityRecord.prototype, "semester", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cgpa', type: 'decimal', precision: 4, scale: 2 }),
    __metadata("design:type", Number)
], SimulatedUniversityRecord.prototype, "cgpa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cpn', type: 'decimal', precision: 6, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SimulatedUniversityRecord.prototype, "cpn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AcademicYear', type: 'varchar', length: 20, default: '2025-2026' }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Gender', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DateOfBirth', type: 'date' }),
    __metadata("design:type", String)
], SimulatedUniversityRecord.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ProfilePictureUrl', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], SimulatedUniversityRecord.prototype, "profilePictureUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SimulatedUniversityRecord.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], SimulatedUniversityRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], SimulatedUniversityRecord.prototype, "updatedAt", void 0);
exports.SimulatedUniversityRecord = SimulatedUniversityRecord = __decorate([
    (0, typeorm_1.Entity)('SimulatedUniversityRecords')
], SimulatedUniversityRecord);
//# sourceMappingURL=SimulatedUniversityRecord.js.map