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
exports.Allocation = void 0;
const typeorm_1 = require("typeorm");
const Application_1 = require("./Application");
const Student_1 = require("./Student");
const Bed_1 = require("./Bed");
const Resident_1 = require("./Resident");
let Allocation = class Allocation {
};
exports.Allocation = Allocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'AllocationId' }),
    __metadata("design:type", Number)
], Allocation.prototype, "allocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ApplicationId', type: 'int' }),
    __metadata("design:type", Number)
], Allocation.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'StudentId', type: 'int' }),
    __metadata("design:type", Number)
], Allocation.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'BedId', type: 'int' }),
    __metadata("design:type", Number)
], Allocation.prototype, "bedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AllocatedAt', type: 'datetime' }),
    __metadata("design:type", Date)
], Allocation.prototype, "allocatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Allocation.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsDeleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Allocation.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DeletedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Allocation.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Allocation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Allocation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Application_1.Application, (a) => a.allocations),
    (0, typeorm_1.JoinColumn)({ name: 'ApplicationId' }),
    __metadata("design:type", Application_1.Application)
], Allocation.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (s) => s.allocations),
    (0, typeorm_1.JoinColumn)({ name: 'StudentId' }),
    __metadata("design:type", Student_1.Student)
], Allocation.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Bed_1.Bed, (b) => b.allocations),
    (0, typeorm_1.JoinColumn)({ name: 'BedId' }),
    __metadata("design:type", Bed_1.Bed)
], Allocation.prototype, "bed", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Resident_1.Resident, (r) => r.allocation),
    __metadata("design:type", Resident_1.Resident)
], Allocation.prototype, "resident", void 0);
exports.Allocation = Allocation = __decorate([
    (0, typeorm_1.Entity)('Allocations')
], Allocation);
//# sourceMappingURL=Allocation.js.map