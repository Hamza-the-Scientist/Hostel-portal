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
exports.AuditLog = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let AuditLog = class AuditLog {
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'LogId' }),
    __metadata("design:type", Number)
], AuditLog.prototype, "logId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TableName', length: 100 }),
    __metadata("design:type", String)
], AuditLog.prototype, "tableName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RecordId', length: 50 }),
    __metadata("design:type", String)
], AuditLog.prototype, "recordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Action', length: 10 }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OldValues', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "oldValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'NewValues', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "newValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IpAddress', length: 45, nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PerformedByUserId', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "performedByUserId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'PerformedAt' }),
    __metadata("design:type", Date)
], AuditLog.prototype, "performedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (u) => u.auditLogs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'PerformedByUserId' }),
    __metadata("design:type", Object)
], AuditLog.prototype, "performedBy", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('AuditLogs')
], AuditLog);
//# sourceMappingURL=AuditLog.js.map