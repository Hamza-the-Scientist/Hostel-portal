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
exports.Announcement = void 0;
const typeorm_1 = require("typeorm");
const Admin_1 = require("./Admin");
let Announcement = class Announcement {
};
exports.Announcement = Announcement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'AnnouncementId' }),
    __metadata("design:type", Number)
], Announcement.prototype, "announcementId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AdminId', type: 'int' }),
    __metadata("design:type", Number)
], Announcement.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Title', type: 'varchar', length: 300 }),
    __metadata("design:type", String)
], Announcement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Content', type: 'text' }),
    __metadata("design:type", String)
], Announcement.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsPublished', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Announcement.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PublishedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Announcement.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ExpiresAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Announcement.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TargetAudience', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Announcement.prototype, "targetAudience", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Announcement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Announcement.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Admin_1.Admin, (a) => a.announcements),
    (0, typeorm_1.JoinColumn)({ name: 'AdminId' }),
    __metadata("design:type", Admin_1.Admin)
], Announcement.prototype, "admin", void 0);
exports.Announcement = Announcement = __decorate([
    (0, typeorm_1.Entity)('Announcements')
], Announcement);
//# sourceMappingURL=Announcement.js.map