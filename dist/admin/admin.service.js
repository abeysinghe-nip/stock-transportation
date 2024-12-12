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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_service_1 = require("../common/common.service");
const driver_entity_1 = require("../driver/entities/driver.entity");
const tempDriver_entity_1 = require("../driver/entities/tempDriver.entity");
const owner_entity_1 = require("../owner/entities/owner.entity");
const tempOwner_entity_1 = require("../owner/entities/tempOwner.entity");
const tempVehicle_entity_1 = require("../vehicle/entities/tempVehicle.entity");
const vehicle_entity_1 = require("../vehicle/entities/vehicle.entity");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("./entites/admin.entity");
const html_1 = require("../templates/html");
const generator = require("generate-password");
const booking_entity_1 = require("../booking/enities/booking.entity");
const sharedBooking_entity_1 = require("../booking/enities/sharedBooking.entity");
const customerFeedback_entity_1 = require("../common/entities/customerFeedback.entity");
const owners_res_1 = require("./responses/owners.res");
const drivers_res_1 = require("./responses/drivers.res");
const customers_res_1 = require("./responses/customers.res");
const customer_entity_1 = require("../customer/entities/customer.entity");
let AdminService = class AdminService {
    constructor(tempOwnerRepo, ownerRepo, tempDriverRepo, driverRepo, tempVehicleRepo, vehicleRepo, adminRepo, bookingRepo, sharedBookingRepo, feedbackRepo, customerRepo, commonService) {
        this.tempOwnerRepo = tempOwnerRepo;
        this.ownerRepo = ownerRepo;
        this.tempDriverRepo = tempDriverRepo;
        this.driverRepo = driverRepo;
        this.tempVehicleRepo = tempVehicleRepo;
        this.vehicleRepo = vehicleRepo;
        this.adminRepo = adminRepo;
        this.bookingRepo = bookingRepo;
        this.sharedBookingRepo = sharedBookingRepo;
        this.feedbackRepo = feedbackRepo;
        this.customerRepo = customerRepo;
        this.commonService = commonService;
    }
    async create(adminDto) {
        const admin = new admin_entity_1.Admin();
        admin.firstName = adminDto.firstName;
        admin.lastName = adminDto.lastName;
        admin.email = adminDto.email;
        admin.password = await this.commonService.passwordEncrypt(adminDto.password);
        return await this.adminRepo.save(admin);
    }
    async signin(email) {
        return await this.adminRepo.findOne({
            where: {
                email: email
            }
        });
    }
    async getTempOwners() {
        return await this.tempOwnerRepo.find();
    }
    async acceptOwner(ownerId) {
        const tempOwner = await this.tempOwnerRepo.findOne({ where: { id: ownerId } });
        const owner = new owner_entity_1.Owner();
        owner.firstName = tempOwner.firstName;
        owner.lastName = tempOwner.lastName;
        owner.address = tempOwner.address;
        owner.nic = tempOwner.nic;
        owner.email = tempOwner.email;
        owner.mobNumber = tempOwner.mobNumber;
        owner.password = tempOwner.password;
        owner.gsCertiUrl = tempOwner.gsCertiUrl;
        const newOwner = await this.ownerRepo.save(owner);
        await this.tempOwnerRepo.delete({ id: ownerId });
        return newOwner;
    }
    async rejectOwner(ownerId) {
        const owner = await this.tempOwnerRepo.findOne({ where: { id: ownerId } });
        await this.tempOwnerRepo.delete({ id: ownerId });
        return owner;
    }
    async getTempDrivers() {
        return await this.tempDriverRepo.find({ relations: ["owner"] });
    }
    async acceptDriver(driverId) {
        const tempDriver = await this.tempDriverRepo.findOne({ where: { id: driverId }, relations: ["owner"] });
        const password = generator.generate({ length: 10, numbers: true });
        const driver = new driver_entity_1.Driver();
        driver.address = tempDriver.address;
        driver.email = tempDriver.email;
        driver.firstName = tempDriver.firstName;
        driver.lastName = tempDriver.lastName;
        driver.password = await this.commonService.passwordEncrypt(password);
        driver.phoneNumber = tempDriver.phoneNumber;
        driver.policeCertiUrl = tempDriver.policeCertiUrl;
        driver.licenseUrl = tempDriver.licenseUrl;
        driver.photoUrl = tempDriver.photoUrl;
        driver.heavyVehicleLic = tempDriver.heavyVehicleLic;
        driver.owner = tempDriver.owner;
        const html = new html_1.HTML(driver.firstName, driver.lastName);
        const message = html.acceptDriverToDriver(driver.email, password);
        await this.commonService.sendNotifications(driver.email, 'Welcome to Gulf Transportation Solution! Your Driver Account is Ready', message);
        await this.driverRepo.save(driver);
        await this.tempDriverRepo.delete({ id: driverId });
        return tempDriver;
    }
    async rejectDriver(driverId) {
        const driver = await this.tempDriverRepo.findOne({ where: { id: driverId }, relations: ["owner"] });
        await this.tempDriverRepo.delete({ id: driverId });
        return driver;
    }
    async getTempVehicles() {
        return await this.tempVehicleRepo.find({ relations: ["owner"] });
    }
    async acceptVehicle(vehicleId) {
        const tempVehicle = await this.tempVehicleRepo.findOne({ where: { id: vehicleId }, relations: ["owner"] });
        const vehicle = new vehicle_entity_1.Vehicle();
        vehicle.type = tempVehicle.type;
        vehicle.regNo = tempVehicle.regNo;
        vehicle.preferredArea = tempVehicle.preferredArea;
        vehicle.capacity = tempVehicle.capacity;
        vehicle.capacityUnit = tempVehicle.capacityUnit;
        vehicle.photoUrl = tempVehicle.photoUrl;
        vehicle.vehicleBookUrl = tempVehicle.vehicleBookUrl;
        vehicle.heavyVehicle = tempVehicle.heavyVehicle;
        vehicle.chargePerKm = tempVehicle.chargePerKm;
        vehicle.owner = tempVehicle.owner;
        await this.vehicleRepo.save(vehicle);
        await this.tempVehicleRepo.delete({ id: vehicleId });
        return tempVehicle;
    }
    async rejectVehicle(vehicleId) {
        const vehicle = await this.tempVehicleRepo.findOne({ where: { id: vehicleId }, relations: ["owner"] });
        await this.tempVehicleRepo.delete({ id: vehicleId });
        return vehicle;
    }
    async changePassword(id, passwordReq) {
        const admin = await this.adminRepo.findOne({
            where: {
                id: id
            }
        });
        const isMatch = await this.commonService.passwordDecrypt(admin.password, passwordReq.oldPassword);
        if (isMatch) {
            const newPw = await this.commonService.passwordEncrypt(passwordReq.newPassword);
            admin.password = newPw;
            return await this.adminRepo.save(admin);
        }
        return undefined;
    }
    async getBookings() {
        return await this.bookingRepo.find({
            relations: ["sharedBooking", "balPayment", "advancePayment"]
        });
    }
    async getFeedbacks() {
        return await this.feedbackRepo.find({
            relations: ["customer"]
        });
    }
    async approveFeedback(feedbackId) {
        const feedback = await this.feedbackRepo.findOne({
            where: {
                id: feedbackId
            }
        });
        feedback.isApproved = true;
        return await this.feedbackRepo.save(feedback);
    }
    async deleteFeedback(feedbackId) {
        const feedback = await this.feedbackRepo.findOne({
            where: {
                id: feedbackId
            }
        });
        await this.feedbackRepo.delete({ id: feedbackId });
        return feedback;
    }
    async getOwners() {
        const owners = await this.ownerRepo.find({
            relations: ["vehicles"]
        });
        const bookings = await this.bookingRepo.find({
            where: {
                status: 'complete'
            },
            relations: ['vehicle']
        });
        const sharedBookings = await this.sharedBookingRepo.find({
            where: {
                status: 'complete'
            },
            relations: ['booking.vehicle']
        });
        const response = [];
        if (owners.length !== 0) {
            for (const o of owners) {
                let originalBookingsCount = 0;
                let sharedBookingsCount = 0;
                const obj = new owners_res_1.OwnersRes();
                obj.id = o.id;
                obj.firstName = o.firstName;
                obj.lastName = o.lastName;
                obj.address = o.address;
                obj.nic = o.nic;
                obj.email = o.email;
                obj.mobNo = o.mobNumber;
                obj.gsCertiUrl = o.gsCertiUrl;
                if (o.vehicles.length !== 0) {
                    for (const v of o.vehicles) {
                        const filteredBookings = bookings.filter((booking) => booking.vehicle.id == v.id);
                        const filteredSharedBookings = sharedBookings.filter((sBooking) => sBooking.booking.vehicle.id == v.id);
                        originalBookingsCount += filteredBookings.length;
                        sharedBookingsCount += filteredSharedBookings.length;
                    }
                }
                obj.originalBoookingCount = originalBookingsCount;
                obj.sharedBookingCount = sharedBookingsCount;
                obj.totalBookingCount = originalBookingsCount + sharedBookingsCount;
                response.push(obj);
            }
        }
        return response;
    }
    async getDrivers(ownerId) {
        const drivers = await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :ownerId", { ownerId: ownerId })
            .andWhere("driver.deleted = :deleted", { deleted: false })
            .getMany();
        const bookings = await this.bookingRepo.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.balPayment', 'balPayment')
            .leftJoinAndSelect('balPayment.driver', 'driver')
            .where('booking.status = :status', { status: 'complete' })
            .andWhere('booking.balPayment IS NOT NULL')
            .getMany();
        const sharedBookings = await this.sharedBookingRepo.createQueryBuilder('sBooking')
            .leftJoinAndSelect('sBooking.balPayment', 'balPayment')
            .leftJoinAndSelect('balPayment.driver', 'driver')
            .where('sBooking.status = :status', { status: 'complete' })
            .andWhere('sBooking.balPayment IS NOT NULL')
            .getMany();
        const response = [];
        if (drivers.length !== 0) {
            for (const d of drivers) {
                const obj = new drivers_res_1.DriversRes();
                obj.id = d.id;
                obj.firstName = d.firstName;
                obj.lastName = d.lastName;
                obj.phoneNumber = d.phoneNumber;
                obj.email = d.email;
                obj.address = d.address;
                obj.policeCertiUrl = d.policeCertiUrl;
                obj.licenseUrl = d.licenseUrl;
                obj.photoUrl = d.photoUrl;
                obj.heavyVehicleLic = d.heavyVehicleLic;
                obj.enabled = d.enabled;
                const filterdBookings = bookings.filter((booking) => booking.balPayment.driver.id === d.id);
                obj.originalBoookingCount = filterdBookings.length;
                const filterdSBookings = sharedBookings.filter((sBooking) => sBooking.balPayment.driver.id === d.id);
                obj.sharedBookingCount = filterdSBookings.length;
                obj.totalBookingCount = filterdBookings.length + filterdSBookings.length;
                response.push(obj);
            }
        }
        return response;
    }
    async getCustomers() {
        const customers = await this.customerRepo.find();
        const bookings = await this.bookingRepo.find({
            where: {
                status: 'complete'
            },
            relations: ['customer']
        });
        const sharedBookings = await this.sharedBookingRepo.find({
            where: {
                status: 'complete'
            },
            relations: ['customer']
        });
        const response = [];
        if (customers.length !== 0) {
            for (const c of customers) {
                const obj = new customers_res_1.CustomersRes();
                obj.id = c.id;
                obj.firstName = c.firstName;
                obj.lastName = c.lastName;
                obj.email = c.email;
                obj.address = c.address;
                obj.nic = c.nic;
                obj.gender = c.gender;
                obj.mobileNum = c.mobileNum;
                obj.profilePic = c.profilePic;
                const originalBookingCount = bookings.filter((booking) => booking.customer.id === c.id);
                obj.originalBoookingCount = originalBookingCount.length;
                const sharedBookingCount = sharedBookings.filter((sBooking) => sBooking.customer.id === c.id);
                obj.sharedBookingCount = sharedBookingCount.length;
                obj.totalBookingCount = originalBookingCount.length + sharedBookingCount.length;
                response.push(obj);
            }
        }
        return response;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tempOwner_entity_1.TempOwner)),
    __param(1, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(2, (0, typeorm_1.InjectRepository)(tempDriver_entity_1.TempDriver)),
    __param(3, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(4, (0, typeorm_1.InjectRepository)(tempVehicle_entity_1.TempVehicle)),
    __param(5, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(6, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(7, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(8, (0, typeorm_1.InjectRepository)(sharedBooking_entity_1.SharedBooking)),
    __param(9, (0, typeorm_1.InjectRepository)(customerFeedback_entity_1.CustomerFeedback)),
    __param(10, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        common_service_1.CommonService])
], AdminService);
//# sourceMappingURL=admin.service.js.map