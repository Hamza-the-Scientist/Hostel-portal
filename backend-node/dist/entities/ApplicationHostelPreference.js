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
exports.ApplicationHostelPreference = void 0;
const typeorm_1 = require("typeorm");
const Application_1 = require("./Application");
const Hostel_1 = require("./Hostel");
let ApplicationHostelPreference = class ApplicationHostelPreference {
};
exports.ApplicationHostelPreference = ApplicationHostelPreference;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'PrefId' }),
    __metadata("design:type", Number)
], ApplicationHostelPreference.prototype, "prefId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ApplicationId' }),
    __metadata("design:type", Number)
], ApplicationHostelPreference.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'HostelId' }),
    __metadata("design:type", Number)
], ApplicationHostelPreference.prototype, "hostelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PreferenceOrder', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ApplicationHostelPreference.prototype, "preferenceOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], ApplicationHostelPreference.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], ApplicationHostelPreference.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Application_1.Application, (a) => a.preferences, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ApplicationId' }),
    __metadata("design:type", Application_1.Application)
], ApplicationHostelPreference.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Hostel_1.Hostel, (h) => h.preferences),
    (0, typeorm_1.JoinColumn)({ name: 'HostelId' }),
    __metadata("design:type", Hostel_1.Hostel)
], ApplicationHostelPreference.prototype, "hostel", void 0);
exports.ApplicationHostelPreference = ApplicationHostelPreference = __decorate([
    (0, typeorm_1.Entity)('ApplicationHostelPreferences')
], ApplicationHostelPreference);
//# sourceMappingURL=ApplicationHostelPreference.js.map