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
exports.Complaint = void 0;
const typeorm_1 = require("typeorm");
let Complaint = class Complaint {
};
exports.Complaint = Complaint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ComplaintId' }),
    __metadata("design:type", Number)
], Complaint.prototype, "complaintId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ResidentId', type: 'int' }),
    __metadata("design:type", Number)
], Complaint.prototype, "residentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Category', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Complaint.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Description', type: 'varchar', length: 2000 }),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', type: 'varchar', length: 20, default: 'Open' }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsDeleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Complaint.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DeletedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Complaint.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Complaint.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Complaint.prototype, "updatedAt", void 0);
exports.Complaint = Complaint = __decorate([
    (0, typeorm_1.Entity)('Complaints')
], Complaint);
//# sourceMappingURL=Complaint.js.map