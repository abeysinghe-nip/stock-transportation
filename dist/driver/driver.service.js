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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const driver_entity_1 = require("./entities/driver.entity");
const typeorm_2 = require("typeorm");
const tempDriver_entity_1 = require("./entities/tempDriver.entity");
const common_service_1 = require("../common/common.service");
const owner_entity_1 = require("../owner/entities/owner.entity");
const driver_vehicle_entity_1 = require("./entities/driver.vehicle.entity");
const booking_entity_1 = require("../booking/enities/booking.entity");
const sharedBooking_entity_1 = require("../booking/enities/sharedBooking.entity");
const ride_gateways_1 = require("../gateways/ride.gateways");
const sendCoord_req_1 = require("./requests/sendCoord.req");
const driverNotification_entity_1 = require("./entities/driverNotification.entity");
let DriverService = class DriverService {
    constructor(driverRepo, tempDriverRepo, ownerRepo, bookingRepo, driverVehiRepo, sharedBookingRepo, notificationRepo, commonService, rideGateway) {
        this.driverRepo = driverRepo;
        this.tempDriverRepo = tempDriverRepo;
        this.ownerRepo = ownerRepo;
        this.bookingRepo = bookingRepo;
        this.driverVehiRepo = driverVehiRepo;
        this.sharedBookingRepo = sharedBookingRepo;
        this.notificationRepo = notificationRepo;
        this.commonService = commonService;
        this.rideGateway = rideGateway;
    }
    async tempCreate(driverDto) {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: driverDto.ownerId
            }
        });
        const driver = new driver_entity_1.Driver();
        driver.address = driverDto.address;
        driver.email = driverDto.email;
        driver.firstName = driverDto.firstName;
        driver.lastName = driverDto.lastName;
        driver.phoneNumber = driverDto.phoneNumber;
        driver.heavyVehicleLic = driverDto.heavyVehicleLic;
        driver.licenseUrl = driverDto.licenseUrl;
        driver.policeCertiUrl = driverDto.policeCertiUrl;
        driver.photoUrl = driverDto.photoUrl;
        driver.owner = owner;
        return await this.tempDriverRepo.save(driver);
    }
    async emailAvilability(email) {
        const driver = await this.driverRepo.findOne({
            where: {
                email: email
            }
        });
        const tempDriver = await this.tempDriverRepo.findOne({
            where: {
                email: email
            }
        });
        if (driver || tempDriver)
            return true;
        return false;
    }
    async signin(email) {
        return await this.driverRepo.findOne({
            where: {
                email: email,
                deleted: false
            }
        });
    }
    async getAssignedVehicle(id) {
        const driverVehicle = await this.driverVehiRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.driverId = :id", { id: id })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getOne();
        return driverVehicle.vehicle;
    }
    async getBookings(vehicle) {
        return await this.bookingRepo.find({
            where: {
                vehicle: vehicle,
                status: (0, typeorm_2.Not)('cancelled'),
                advancePayment: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                isCancelled: false
            },
            order: {
                bookingDate: 'ASC'
            }
        });
    }
    async getSharedBookings(vehicle) {
        return await this.sharedBookingRepo.createQueryBuilder("sBooking")
            .leftJoinAndSelect("sBooking.booking", "booking")
            .where("booking.vehicleId = :vehicleId", { vehicleId: vehicle.id })
            .andWhere("booking.status = :status", { status: 'cancelled' })
            .andWhere("booking.isCancelled = :isCancelled", { isCancelled: true })
            .andWhere("sBooking.status != :status", { status: 'cancelled' })
            .andWhere("sBooking.isCancelled = false")
            .andWhere("sBooking.advancePayment IS NOT NULL")
            .orderBy("booking.bookingDate", 'DESC')
            .getMany();
    }
    async getSharedBooking(bookingId) {
        const booking = await this.bookingRepo.findOne({
            where: {
                id: bookingId,
                isCancelled: false,
                advancePayment: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
            },
        });
        return await this.sharedBookingRepo.createQueryBuilder("sharedBookings")
            .where("sharedBookings.bookingId = :bookingId", { bookingId: booking.id })
            .andWhere("sharedBookings.isCancelled = :isCancelled", { isCancelled: false })
            .andWhere("sharedBookings.advancePaymentId IS NOT NULL")
            .andWhere("sharedBookings.status = :status", { status: 'upcoming' })
            .getMany();
    }
    async startRide(rideStartReq) {
        const driver = await this.driverRepo.findOne({
            where: {
                id: rideStartReq.id
            }
        });
        let booking;
        const gatewayData = new sendCoord_req_1.SendCoordReq();
        gatewayData.longitude = rideStartReq.longitude;
        gatewayData.latitude = rideStartReq.latitude;
        if (rideStartReq.bookingType === 'original') {
            booking = await this.bookingRepo.findOne({
                where: {
                    id: rideStartReq.bookingId
                },
                relations: ["customer"]
            });
            gatewayData.bookingId = booking.id;
        }
        else {
            booking = await this.sharedBookingRepo.findOne({
                where: {
                    id: rideStartReq.bookingId
                },
                relations: ["customer"]
            });
            gatewayData.bookingId = booking.id;
        }
        ;
        this.rideGateway.sendCoordinates(gatewayData);
        return { booking: booking, driver: driver };
    }
    async stopRide(driverId, rideStopReq) {
        const driver = await this.driverRepo.findOne({
            where: {
                id: driverId
            }
        });
        let booking;
        if (rideStopReq.bookingType === 'original') {
            booking = await this.bookingRepo.findOne({
                where: {
                    id: rideStopReq.bookingId
                },
                relations: ["customer"]
            });
        }
        else {
            booking = await this.sharedBookingRepo.findOne({
                where: {
                    id: rideStopReq.bookingId
                },
                relations: ["customer"]
            });
        }
        return {
            cusFName: booking.customer.firstName,
            cusLName: booking.customer.lastName,
            email: booking.customer.email,
            driverFName: driver.firstName,
            driverLName: driver.lastName,
            driverPNo: driver.phoneNumber
        };
    }
    async changePassword(id, passwordReq) {
        const driver = await this.driverRepo.findOne({
            where: {
                id: id
            }
        });
        const isMatch = await this.commonService.passwordDecrypt(driver.password, passwordReq.oldPassword);
        if (isMatch) {
            const newPw = await this.commonService.passwordEncrypt(passwordReq.newPassword);
            driver.password = newPw;
            return await this.driverRepo.save(driver);
        }
        return undefined;
    }
    async getProfile(id) {
        return await this.driverRepo.findOne({
            where: {
                id: id
            }
        });
    }
    async updateProfile(id, updateReq) {
        const driver = await this.driverRepo.findOne({
            where: {
                id: id
            }
        });
        driver.phoneNumber = updateReq.mobileNo;
        driver.photoUrl = updateReq.profilePic;
        return await this.driverRepo.save(driver);
    }
    async getNotifications(id) {
        return await this.notificationRepo.createQueryBuilder("notification")
            .where('notification.driverId = :driverId', { driverId: id })
            .orderBy('notification.date', 'DESC')
            .getMany();
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(1, (0, typeorm_1.InjectRepository)(tempDriver_entity_1.TempDriver)),
    __param(2, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(4, (0, typeorm_1.InjectRepository)(driver_vehicle_entity_1.DriverVehicle)),
    __param(5, (0, typeorm_1.InjectRepository)(sharedBooking_entity_1.SharedBooking)),
    __param(6, (0, typeorm_1.InjectRepository)(driverNotification_entity_1.DriverNotification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        common_service_1.CommonService,
        ride_gateways_1.RideGateway])
], DriverService);
//# sourceMappingURL=driver.service.js.map