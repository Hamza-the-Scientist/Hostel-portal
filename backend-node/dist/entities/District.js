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
exports.District = void 0;
const typeorm_1 = require("typeorm");
const Student_1 = require("./Student");
let District = class District {
};
exports.District = District;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'DistrictId' }),
    __metadata("design:type", Number)
], District.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Name', length: 100 }),
    __metadata("design:type", String)
], District.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Province', length: 50, default: 'Sindh' }),
    __metadata("design:type", String)
], District.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], District.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], District.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Student_1.Student, (s) => s.district),
    __metadata("design:type", Array)
], District.prototype, "students", void 0);
exports.District = District = __decorate([
    (0, typeorm_1.Entity)('Districts')
], District);
//# sourceMappingURL=District.js.map