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
exports.ProcessingFee = void 0;
const typeorm_1 = require("typeorm");
let ProcessingFee = class ProcessingFee {
};
exports.ProcessingFee = ProcessingFee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'FeeId' }),
    __metadata("design:type", Number)
], ProcessingFee.prototype, "feeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ApplicationId', unique: true }),
    __metadata("design:type", Number)
], ProcessingFee.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProcessingFee.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', length: 10, default: 'Pending' }),
    __metadata("design:type", String)
], ProcessingFee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DueDate', type: 'date' }),
    __metadata("design:type", String)
], ProcessingFee.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], ProcessingFee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], ProcessingFee.prototype, "updatedAt", void 0);
exports.ProcessingFee = ProcessingFee = __decorate([
    (0, typeorm_1.Entity)('ProcessingFees')
], ProcessingFee);
//# sourceMappingURL=ProcessingFee.js.map