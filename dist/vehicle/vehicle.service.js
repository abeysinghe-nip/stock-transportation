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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tempVehicle_entity_1 = require("./entities/tempVehicle.entity");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const owner_entity_1 = require("../owner/entities/owner.entity");
const driver_vehicle_entity_1 = require("../driver/entities/driver.vehicle.entity");
let VehicleService = class VehicleService {
    constructor(tempVehicleRepo, vehicleRepo, ownerRepo, driverVehicleRepo) {
        this.tempVehicleRepo = tempVehicleRepo;
        this.vehicleRepo = vehicleRepo;
        this.ownerRepo = ownerRepo;
        this.driverVehicleRepo = driverVehicleRepo;
    }
    async createVehicle(vehicleDto) {
        const owner = await this.ownerRepo.findOne({ where: { id: vehicleDto.ownerId } });
        const vehicle = new tempVehicle_entity_1.TempVehicle();
        vehicle.capacity = vehicleDto.capacity;
        vehicle.capacityUnit = vehicleDto.capacityUnit;
        vehicle.owner = owner;
        vehicle.photoUrl = vehicleDto.photoUrl;
        vehicle.preferredArea = vehicleDto.preferredArea;
        vehicle.regNo = vehicleDto.regNo;
        vehicle.type = vehicleDto.type;
        vehicle.vehicleBookUrl = vehicleDto.vehicleBookUrl;
        vehicle.chargePerKm = vehicleDto.chargePerKm;
        vehicle.heavyVehicle = vehicleDto.heavyVehicle;
        return await this.tempVehicleRepo.save(vehicle);
    }
    async getAllVehicles() {
        const vehicles = [];
        const driverVehicles = await this.driverVehicleRepo.createQueryBuilder("DriverVehi")
            .leftJoinAndSelect("DriverVehi.vehicle", "vehicle")
            .where("DriverVehi.removedDate IS NULL")
            .getMany();
        if (driverVehicles.length !== 0) {
            for (const driverVehicle of driverVehicles) {
                vehicles.push(driverVehicle.vehicle);
            }
        }
        return vehicles;
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tempVehicle_entity_1.TempVehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(2, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(3, (0, typeorm_1.InjectRepository)(driver_vehicle_entity_1.DriverVehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VehicleService);
//# sourceMappingURL=vehicle.service.js.map