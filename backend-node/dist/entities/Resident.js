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
exports.Resident = void 0;
const typeorm_1 = require("typeorm");
const Allocation_1 = require("./Allocation");
let Resident = class Resident {
};
exports.Resident = Resident;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ResidentId' }),
    __metadata("design:type", Number)
], Resident.prototype, "residentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AllocationId', type: 'int' }),
    __metadata("design:type", Number)
], Resident.prototype, "allocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CheckInDate', type: 'date' }),
    __metadata("design:type", String)
], Resident.prototype, "checkInDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CheckOutDate', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Resident.prototype, "checkOutDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsCurrentResident', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Resident.prototype, "isCurrentResident", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Resident.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Resident.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Allocation_1.Allocation, (a) => a.resident),
    (0, typeorm_1.JoinColumn)({ name: 'AllocationId' }),
    __metadata("design:type", Allocation_1.Allocation)
], Resident.prototype, "allocation", void 0);
exports.Resident = Resident = __decorate([
    (0, typeorm_1.Entity)('Residents')
], Resident);
//# sourceMappingURL=Resident.js.map