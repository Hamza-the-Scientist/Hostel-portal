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
exports.Admin = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Announcement_1 = require("./Announcement");
let Admin = class Admin {
};
exports.Admin = Admin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'AdminId' }),
    __metadata("design:type", Number)
], Admin.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'UserId', type: 'int' }),
    __metadata("design:type", Number)
], Admin.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'EmployeeId', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Department', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Admin.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Admin.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, (u) => u.admin),
    (0, typeorm_1.JoinColumn)({ name: 'UserId' }),
    __metadata("design:type", User_1.User)
], Admin.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Announcement_1.Announcement, (a) => a.admin),
    __metadata("design:type", Array)
], Admin.prototype, "announcements", void 0);
exports.Admin = Admin = __decorate([
    (0, typeorm_1.Entity)('Admins')
], Admin);
//# sourceMappingURL=Admin.js.map