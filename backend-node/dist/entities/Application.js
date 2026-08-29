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
exports.Application = void 0;
const typeorm_1 = require("typeorm");
const Student_1 = require("./Student");
const AcademicYear_1 = require("./AcademicYear");
const ApplicationHostelPreference_1 = require("./ApplicationHostelPreference");
const Allocation_1 = require("./Allocation");
let Application = class Application {
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ApplicationId' }),
    __metadata("design:type", Number)
], Application.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'StudentId', type: 'int' }),
    __metadata("design:type", Number)
], Application.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AcademicYearId', type: 'int' }),
    __metadata("design:type", Number)
], Application.prototype, "academicYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', type: 'varchar', length: 20, default: 'Submitted' }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SubmittedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Application.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Application.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Application.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (s) => s.applications),
    (0, typeorm_1.JoinColumn)({ name: 'StudentId' }),
    __metadata("design:type", Student_1.Student)
], Application.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AcademicYear_1.AcademicYear),
    (0, typeorm_1.JoinColumn)({ name: 'AcademicYearId' }),
    __metadata("design:type", AcademicYear_1.AcademicYear)
], Application.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ApplicationHostelPreference_1.ApplicationHostelPreference, (p) => p.application),
    __metadata("design:type", Array)
], Application.prototype, "preferences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Allocation_1.Allocation, (a) => a.application),
    __metadata("design:type", Array)
], Application.prototype, "allocations", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)('Applications')
], Application);
//# sourceMappingURL=Application.js.map