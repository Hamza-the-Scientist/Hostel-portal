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
exports.StudentProfile = void 0;
const typeorm_1 = require("typeorm");
const Student_1 = require("./Student");
let StudentProfile = class StudentProfile {
};
exports.StudentProfile = StudentProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ProfileId' }),
    __metadata("design:type", Number)
], StudentProfile.prototype, "profileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'StudentId', type: 'int' }),
    __metadata("design:type", Number)
], StudentProfile.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PhotoUrl', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GuardianName', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "guardianName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GuardianPhone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "guardianPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'GuardianRelation', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "guardianRelation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'HomeAddress', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "homeAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'City', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'EmergencyContact', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'BloodGroup', type: 'varchar', length: 5, nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "bloodGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Disabilities', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StudentProfile.prototype, "disabilities", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], StudentProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], StudentProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Student_1.Student, (s) => s.profile),
    (0, typeorm_1.JoinColumn)({ name: 'StudentId' }),
    __metadata("design:type", Student_1.Student)
], StudentProfile.prototype, "student", void 0);
exports.StudentProfile = StudentProfile = __decorate([
    (0, typeorm_1.Entity)('StudentProfiles')
], StudentProfile);
//# sourceMappingURL=StudentProfile.js.map