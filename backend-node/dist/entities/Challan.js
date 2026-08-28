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
exports.Challan = void 0;
const typeorm_1 = require("typeorm");
let Challan = class Challan {
};
exports.Challan = Challan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ChallanId' }),
    __metadata("design:type", Number)
], Challan.prototype, "challanId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FeeId' }),
    __metadata("design:type", Number)
], Challan.prototype, "feeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ChallanNumber', length: 50, unique: true }),
    __metadata("design:type", String)
], Challan.prototype, "challanNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DueDate', type: 'date' }),
    __metadata("design:type", String)
], Challan.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Challan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Challan.prototype, "updatedAt", void 0);
exports.Challan = Challan = __decorate([
    (0, typeorm_1.Entity)('Challans')
], Challan);
//# sourceMappingURL=Challan.js.map