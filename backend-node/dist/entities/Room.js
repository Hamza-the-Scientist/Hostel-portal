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
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const Floor_1 = require("./Floor");
const Bed_1 = require("./Bed");
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'RoomId' }),
    __metadata("design:type", Number)
], Room.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FloorId', type: 'int' }),
    __metadata("design:type", Number)
], Room.prototype, "floorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RoomNumber', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Room.prototype, "roomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RoomType', type: 'varchar', length: 10, default: 'Double' }),
    __metadata("design:type", String)
], Room.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsActive', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Room.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'IsDeleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Room.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DeletedAt', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Room.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Room.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Floor_1.Floor, (f) => f.rooms, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'FloorId' }),
    __metadata("design:type", Floor_1.Floor)
], Room.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Bed_1.Bed, (b) => b.room),
    __metadata("design:type", Array)
], Room.prototype, "beds", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)('Rooms')
], Room);
//# sourceMappingURL=Room.js.map