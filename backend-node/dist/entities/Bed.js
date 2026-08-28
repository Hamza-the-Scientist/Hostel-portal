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
exports.Bed = void 0;
const typeorm_1 = require("typeorm");
const Room_1 = require("./Room");
const Allocation_1 = require("./Allocation");
let Bed = class Bed {
};
exports.Bed = Bed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'BedId' }),
    __metadata("design:type", Number)
], Bed.prototype, "bedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RoomId' }),
    __metadata("design:type", Number)
], Bed.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'BedLabel', length: 10 }),
    __metadata("design:type", String)
], Bed.prototype, "bedLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', default: true }),
    __metadata("design:type", Boolean)
], Bed.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsDeleted', default: false }),
    __metadata("design:type", Boolean)
], Bed.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DeletedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Bed.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Bed.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Bed.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, (r) => r.beds, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'RoomId' }),
    __metadata("design:type", Room_1.Room)
], Bed.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Allocation_1.Allocation, (a) => a.bed),
    __metadata("design:type", Array)
], Bed.prototype, "allocations", void 0);
exports.Bed = Bed = __decorate([
    (0, typeorm_1.Entity)('Beds')
], Bed);
//# sourceMappingURL=Bed.js.map