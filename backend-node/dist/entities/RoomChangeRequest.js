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
exports.RoomChangeRequest = void 0;
const typeorm_1 = require("typeorm");
let RoomChangeRequest = class RoomChangeRequest {
};
exports.RoomChangeRequest = RoomChangeRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'RequestId' }),
    __metadata("design:type", Number)
], RoomChangeRequest.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ResidentId', type: 'int' }),
    __metadata("design:type", Number)
], RoomChangeRequest.prototype, "residentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RequestedRoomId', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], RoomChangeRequest.prototype, "requestedRoomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Reason', type: 'varchar', length: 1000, nullable: true }),
    __metadata("design:type", Object)
], RoomChangeRequest.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', type: 'varchar', length: 20, default: 'Pending' }),
    __metadata("design:type", String)
], RoomChangeRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], RoomChangeRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], RoomChangeRequest.prototype, "updatedAt", void 0);
exports.RoomChangeRequest = RoomChangeRequest = __decorate([
    (0, typeorm_1.Entity)('RoomChangeRequests')
], RoomChangeRequest);
//# sourceMappingURL=RoomChangeRequest.js.map