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
exports.Program = void 0;
const typeorm_1 = require("typeorm");
const Department_1 = require("./Department");
let Program = class Program {
};
exports.Program = Program;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ProgramId' }),
    __metadata("design:type", Number)
], Program.prototype, "programId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DepartmentId' }),
    __metadata("design:type", Number)
], Program.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Name', length: 150 }),
    __metadata("design:type", String)
], Program.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Code', length: 20, unique: true }),
    __metadata("design:type", String)
], Program.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DegreeType', length: 20 }),
    __metadata("design:type", String)
], Program.prototype, "degreeType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Program.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Program.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.Department, (d) => d.programs),
    (0, typeorm_1.JoinColumn)({ name: 'DepartmentId' }),
    __metadata("design:type", Department_1.Department)
], Program.prototype, "department", void 0);
exports.Program = Program = __decorate([
    (0, typeorm_1.Entity)('Programs')
], Program);
//# sourceMappingURL=Program.js.map