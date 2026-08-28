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
exports.Hostel = void 0;
const typeorm_1 = require("typeorm");
const HostelAmenity_1 = require("./HostelAmenity");
const HostelImage_1 = require("./HostelImage");
const Block_1 = require("./Block");
const Review_1 = require("./Review");
const EligibilityRule_1 = require("./EligibilityRule");
const ApplicationHostelPreference_1 = require("./ApplicationHostelPreference");
let Hostel = class Hostel {
};
exports.Hostel = Hostel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'HostelId' }),
    __metadata("design:type", Number)
], Hostel.prototype, "hostelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Name', length: 150 }),
    __metadata("design:type", String)
], Hostel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Gender', length: 10 }),
    __metadata("design:type", String)
], Hostel.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TotalCapacity', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Hostel.prototype, "totalCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Address', nullable: true }),
    __metadata("design:type", Object)
], Hostel.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Hostel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'EligibilityRequirement', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Hostel.prototype, "eligibilityRequirement", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Warden', length: 150, nullable: true }),
    __metadata("design:type", Object)
], Hostel.prototype, "warden", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'WardenPhone', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Hostel.prototype, "wardenPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', default: true }),
    __metadata("design:type", Boolean)
], Hostel.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsDeleted', default: false }),
    __metadata("design:type", Boolean)
], Hostel.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DeletedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Hostel.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Hostel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Hostel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HostelAmenity_1.HostelAmenity, (a) => a.hostel, { cascade: true }),
    __metadata("design:type", Array)
], Hostel.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HostelImage_1.HostelImage, (i) => i.hostel, { cascade: true }),
    __metadata("design:type", Array)
], Hostel.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Block_1.Block, (b) => b.hostel),
    __metadata("design:type", Array)
], Hostel.prototype, "blocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, (r) => r.hostel),
    __metadata("design:type", Array)
], Hostel.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EligibilityRule_1.EligibilityRule, (r) => r.hostel),
    __metadata("design:type", Array)
], Hostel.prototype, "eligibilityRules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ApplicationHostelPreference_1.ApplicationHostelPreference, (p) => p.hostel),
    __metadata("design:type", Array)
], Hostel.prototype, "preferences", void 0);
exports.Hostel = Hostel = __decorate([
    (0, typeorm_1.Entity)('Hostels')
], Hostel);
//# sourceMappingURL=Hostel.js.map