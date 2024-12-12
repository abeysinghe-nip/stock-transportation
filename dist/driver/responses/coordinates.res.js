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
exports.CoordinatesRes = void 0;
const swagger_1 = require("@nestjs/swagger");
class CoordinatesRes {
}
exports.CoordinatesRes = CoordinatesRes;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "firstLong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "firstLat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "secondLong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "secondLat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "thirdLong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "thirdLat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "fourthLong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0.0 }),
    __metadata("design:type", Number)
], CoordinatesRes.prototype, "fourthLat", void 0);
//# sourceMappingURL=coordinates.res.js.map