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
exports.AdminSettings = void 0;
const typeorm_1 = require("typeorm");
let AdminSettings = class AdminSettings {
};
exports.AdminSettings = AdminSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'SettingsId' }),
    __metadata("design:type", Number)
], AdminSettings.prototype, "settingsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AllocationOpen', default: true }),
    __metadata("design:type", Boolean)
], AdminSettings.prototype, "allocationOpen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AllocationDeadline', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], AdminSettings.prototype, "allocationDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MaxAllocationPerCycle', type: 'int', default: 100 }),
    __metadata("design:type", Number)
], AdminSettings.prototype, "maxAllocationPerCycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'AllocationEnabled', default: true }),
    __metadata("design:type", Boolean)
], AdminSettings.prototype, "allocationEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'EffectiveFrom', type: 'datetime' }),
    __metadata("design:type", Date)
], AdminSettings.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], AdminSettings.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], AdminSettings.prototype, "updatedAt", void 0);
exports.AdminSettings = AdminSettings = __decorate([
    (0, typeorm_1.Entity)('AdminSettings')
], AdminSettings);
//# sourceMappingURL=AdminSettings.js.map