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
exports.Student = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const StudentProfile_1 = require("./StudentProfile");
const UniversityStudentRecord_1 = require("./UniversityStudentRecord");
const District_1 = require("./District");
const Application_1 = require("./Application");
const Allocation_1 = require("./Allocation");
let Student = class Student {
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'StudentId' }),
    __metadata("design:type", Number)
], Student.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UserId', type: 'int' }),
    __metadata("design:type", Number)
], Student.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RegistrationNumber', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Student.prototype, "registrationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Cnic', type: 'varchar', length: 13, unique: true }),
    __metadata("design:type", String)
], Student.prototype, "cnic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Gender', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Student.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DateOfBirth', type: 'date' }),
    __metadata("design:type", String)
], Student.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DistrictId', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Student.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsDeleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Student.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DeletedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Student.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Student.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Student.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, (u) => u.student),
    (0, typeorm_1.JoinColumn)({ name: 'UserId' }),
    __metadata("design:type", User_1.User)
], Student.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => District_1.District, (d) => d.students, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'DistrictId' }),
    __metadata("design:type", Object)
], Student.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => StudentProfile_1.StudentProfile, (p) => p.student, { cascade: true }),
    __metadata("design:type", StudentProfile_1.StudentProfile)
], Student.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UniversityStudentRecord_1.UniversityStudentRecord, (r) => r.student, { cascade: true }),
    __metadata("design:type", UniversityStudentRecord_1.UniversityStudentRecord)
], Student.prototype, "universityRecord", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Application_1.Application, (a) => a.student),
    __metadata("design:type", Array)
], Student.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Allocation_1.Allocation, (a) => a.student),
    __metadata("design:type", Array)
], Student.prototype, "allocations", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)('Students')
], Student);
//# sourceMappingURL=Student.js.map