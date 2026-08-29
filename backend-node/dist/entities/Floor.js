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
exports.Floor = void 0;
const typeorm_1 = require("typeorm");
const Block_1 = require("./Block");
const Room_1 = require("./Room");
let Floor = class Floor {
};
exports.Floor = Floor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'FloorId' }),
    __metadata("design:type", Number)
], Floor.prototype, "floorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'BlockId', type: 'int' }),
    __metadata("design:type", Number)
], Floor.prototype, "blockId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FloorNumber', type: 'int' }),
    __metadata("design:type", Number)
], Floor.prototype, "floorNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CreatedAt' }),
    __metadata("design:type", Date)
], Floor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'UpdatedAt' }),
    __metadata("design:type", Date)
], Floor.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Block_1.Block, (b) => b.floors, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'BlockId' }),
    __metadata("design:type", Block_1.Block)
], Floor.prototype, "block", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Room_1.Room, (r) => r.floor),
    __metadata("design:type", Array)
], Floor.prototype, "rooms", void 0);
exports.Floor = Floor = __decorate([
    (0, typeorm_1.Entity)('Floors')
], Floor);
//# sourceMappingURL=Floor.js.map