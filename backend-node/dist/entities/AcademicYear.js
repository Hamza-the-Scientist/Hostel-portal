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
exports.AcademicYear = void 0;
const typeorm_1 = require("typeorm");
let AcademicYear = class AcademicYear {
};
exports.AcademicYear = AcademicYear;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'AcademicYearId' }),
    __metadata("design:type", Number)
], AcademicYear.prototype, "academicYearId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Label', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], AcademicYear.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'StartDate', type: 'date' }),
    __metadata("design:type", String)
], AcademicYear.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'EndDate', type: 'date' }),
    __metadata("design:type", String)
], AcademicYear.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AcademicYear.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], AcademicYear.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], AcademicYear.prototype, "updatedAt", void 0);
exports.AcademicYear = AcademicYear = __decorate([
    (0, typeorm_1.Entity)('AcademicYears')
], AcademicYear);
//# sourceMappingURL=AcademicYear.js.map