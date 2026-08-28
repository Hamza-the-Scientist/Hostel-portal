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
exports.UniversityStudentRecord = void 0;
const typeorm_1 = require("typeorm");
const Student_1 = require("./Student");
const Department_1 = require("./Department");
const Program_1 = require("./Program");
let UniversityStudentRecord = class UniversityStudentRecord {
};
exports.UniversityStudentRecord = UniversityStudentRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'RecordId' }),
    __metadata("design:type", Number)
], UniversityStudentRecord.prototype, "recordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'StudentId' }),
    __metadata("design:type", Number)
], UniversityStudentRecord.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DepartmentId', nullable: true }),
    __metadata("design:type", Object)
], UniversityStudentRecord.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ProgramId', nullable: true }),
    __metadata("design:type", Object)
], UniversityStudentRecord.prototype, "programId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Semester', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], UniversityStudentRecord.prototype, "semester", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cgpa', type: 'decimal', precision: 4, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], UniversityStudentRecord.prototype, "cgpa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsVerified', default: true }),
    __metadata("design:type", Boolean)
], UniversityStudentRecord.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'VerifiedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], UniversityStudentRecord.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'VerifiedBy', nullable: true }),
    __metadata("design:type", Object)
], UniversityStudentRecord.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], UniversityStudentRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], UniversityStudentRecord.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Student_1.Student, (s) => s.universityRecord),
    (0, typeorm_1.JoinColumn)({ name: 'StudentId' }),
    __metadata("design:type", Student_1.Student)
], UniversityStudentRecord.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.Department, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'DepartmentId' }),
    __metadata("design:type", Object)
], UniversityStudentRecord.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Program_1.Program, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ProgramId' }),
    __metadata("design:type", Object)
], UniversityStudentRecord.prototype, "program", void 0);
exports.UniversityStudentRecord = UniversityStudentRecord = __decorate([
    (0, typeorm_1.Entity)('UniversityStudentRecords')
], UniversityStudentRecord);
//# sourceMappingURL=UniversityStudentRecord.js.map