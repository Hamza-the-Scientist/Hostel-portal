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
exports.EligibilityRule = void 0;
const typeorm_1 = require("typeorm");
const Hostel_1 = require("./Hostel");
let EligibilityRule = class EligibilityRule {
};
exports.EligibilityRule = EligibilityRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'RuleId' }),
    __metadata("design:type", Number)
], EligibilityRule.prototype, "ruleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'HostelId', type: 'int' }),
    __metadata("design:type", Number)
], EligibilityRule.prototype, "hostelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RuleType', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], EligibilityRule.prototype, "ruleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RuleMode', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], EligibilityRule.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Values', type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], EligibilityRule.prototype, "values", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EligibilityRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], EligibilityRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], EligibilityRule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Hostel_1.Hostel, (h) => h.eligibilityRules, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'HostelId' }),
    __metadata("design:type", Hostel_1.Hostel)
], EligibilityRule.prototype, "hostel", void 0);
exports.EligibilityRule = EligibilityRule = __decorate([
    (0, typeorm_1.Entity)('EligibilityRules')
], EligibilityRule);
//# sourceMappingURL=EligibilityRule.js.map