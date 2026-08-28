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
exports.HostelImage = void 0;
const typeorm_1 = require("typeorm");
const Hostel_1 = require("./Hostel");
let HostelImage = class HostelImage {
};
exports.HostelImage = HostelImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ImageId' }),
    __metadata("design:type", Number)
], HostelImage.prototype, "imageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'HostelId' }),
    __metadata("design:type", Number)
], HostelImage.prototype, "hostelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ImageUrl', length: 500 }),
    __metadata("design:type", String)
], HostelImage.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsPrimary', default: false }),
    __metadata("design:type", Boolean)
], HostelImage.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], HostelImage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], HostelImage.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Hostel_1.Hostel, (h) => h.images, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'HostelId' }),
    __metadata("design:type", Hostel_1.Hostel)
], HostelImage.prototype, "hostel", void 0);
exports.HostelImage = HostelImage = __decorate([
    (0, typeorm_1.Entity)('HostelImages')
], HostelImage);
//# sourceMappingURL=HostelImage.js.map