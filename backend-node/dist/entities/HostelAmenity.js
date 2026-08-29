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
exports.HostelAmenity = void 0;
const typeorm_1 = require("typeorm");
const Hostel_1 = require("./Hostel");
let HostelAmenity = class HostelAmenity {
};
exports.HostelAmenity = HostelAmenity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'AmenityId' }),
    __metadata("design:type", Number)
], HostelAmenity.prototype, "amenityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'HostelId', type: 'int' }),
    __metadata("design:type", Number)
], HostelAmenity.prototype, "hostelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AmenityName', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], HostelAmenity.prototype, "amenityName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], HostelAmenity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], HostelAmenity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Hostel_1.Hostel, (h) => h.amenities, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'HostelId' }),
    __metadata("design:type", Hostel_1.Hostel)
], HostelAmenity.prototype, "hostel", void 0);
exports.HostelAmenity = HostelAmenity = __decorate([
    (0, typeorm_1.Entity)('HostelAmenities')
], HostelAmenity);
//# sourceMappingURL=HostelAmenity.js.map