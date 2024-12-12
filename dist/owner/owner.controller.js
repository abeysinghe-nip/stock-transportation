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
exports.OwnerController = void 0;
const common_1 = require("@nestjs/common");
const owner_service_1 = require("./owner.service");
const swagger_1 = require("@nestjs/swagger");
const owner_dto_1 = require("./dtos/owner.dto");
const html_1 = require("../templates/html");
const common_service_1 = require("../common/common.service");
const driver_dto_1 = require("../driver/dtos/driver.dto");
const driver_service_1 = require("../driver/driver.service");
const vehicle_dto_1 = require("../vehicle/dtos/vehicle.dto");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const signIn_dto_1 = require("../common/requests/signIn.dto");
const signin_res_1 = require("../common/responses/signin.res");
const assignDriver_req_1 = require("./requests/assignDriver.req");
const assignDriver_res_1 = require("./responses/assignDriver.res");
const auth_service_1 = require("../auth/auth.service");
const auth_guard_1 = require("../auth/auth.guard");
const booking_service_1 = require("../booking/booking.service");
const common_res_1 = require("../common/responses/common.res");
const changePassword_req_1 = require("../common/requests/changePassword.req");
const wallet_res_1 = require("./responses/wallet.res");
const bankAcc_req_1 = require("./requests/bankAcc.req");
const withdrawal_req_1 = require("./requests/withdrawal.req");
const ownerRewards_req_1 = require("./requests/ownerRewards.req");
const profile_res_1 = require("./responses/profile.res");
const updateProfile_req_1 = require("../common/requests/updateProfile.req");
const notification_res_1 = require("../common/responses/notification.res");
let OwnerController = class OwnerController {
    constructor(ownerService, commonService, driverService, vehicleService, authService, bookingService) {
        this.ownerService = ownerService;
        this.commonService = commonService;
        this.driverService = driverService;
        this.vehicleService = vehicleService;
        this.authService = authService;
        this.bookingService = bookingService;
    }
    async tempCreate(ownerDto, res) {
        try {
            const owner = await this.ownerService.create(ownerDto);
            const html = new html_1.HTML(owner.firstName, owner.lastName);
            const message = html.pendingOwner();
            await this.commonService.sendNotifications(owner.email, 'Your Account is Pending Approval', message);
            return res.status(common_1.HttpStatus.OK).json("Owner succefully created");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async signin(signinDto, res) {
        try {
            const owner = await this.ownerService.signin(signinDto.userName);
            if (owner) {
                const isMatched = await this.commonService.passwordDecrypt(owner.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(owner.id, owner.email);
                    return res.status(common_1.HttpStatus.OK).json(access_token);
                }
                return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(common_1.HttpStatus.NOT_FOUND).json("Owner not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async emailAvailability(email, res) {
        try {
            const resp = await this.ownerService.emailAvilability(email);
            if (resp) {
                return res.status(common_1.HttpStatus.CONFLICT).json("Email exist");
            }
            return res.status(common_1.HttpStatus.OK).json("Email not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async createDriver(driverDto, res) {
        try {
            const driver = await this.driverService.tempCreate(driverDto);
            const html = new html_1.HTML(driver.owner.firstName, driver.owner.lastName);
            const message = html.pendingDriver(driver.firstName, driver.lastName);
            await this.commonService.sendNotifications(driver.owner.email, `Driver ${driver.firstName} ${driver.lastName} Registration Submitted for Approval.`, message);
            return res.status(common_1.HttpStatus.OK).json("Driver succefully created");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async createVehile(vehicleDto, res) {
        try {
            const vehicle = await this.vehicleService.createVehicle(vehicleDto);
            const html = new html_1.HTML(vehicle.owner.firstName, vehicle.owner.lastName);
            const message = html.pendingVehicle(vehicle.regNo);
            await this.commonService.sendNotifications(vehicle.owner.email, `Vehicle No:${vehicle.regNo} Registration Submitted for Approval`, message);
            return res.status(common_1.HttpStatus.OK).json("Vehicle succefully created");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async assignDriver(assignDriver, res) {
        try {
            const resp = await this.ownerService.assignDriver(assignDriver);
            return res.status(common_1.HttpStatus.OK).json({ assignId: resp.id });
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getAssignedDrivers(id, res) {
        try {
            const resp = await this.ownerService.getAssignedDrivers(id);
            const response = [];
            if (resp.length != 0) {
                for (const r of resp) {
                    const resObj = {};
                    resObj.id = r.id;
                    resObj.assignedDate = r.assignedDate;
                    const driver = {};
                    driver.id = r.driver.id;
                    driver.firstName = r.driver.firstName;
                    driver.lastName = r.driver.lastName;
                    driver.email = r.driver.email;
                    driver.phoneNumber = r.driver.phoneNumber;
                    driver.address = r.driver.address;
                    driver.photoUrl = r.driver.photoUrl;
                    driver.licenseUrl = r.driver.licenseUrl;
                    resObj.driver = driver;
                    const vehicle = {};
                    vehicle.id = r.vehicle.id;
                    vehicle.type = r.vehicle.type;
                    vehicle.regNo = r.vehicle.regNo;
                    vehicle.photoUrl = r.vehicle.photoUrl;
                    vehicle.heavyVehicle = r.vehicle.heavyVehicle;
                    resObj.vehicle = vehicle;
                    response.push(resObj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getUnssignedDrivers(id, res) {
        try {
            const resp = await this.ownerService.getUnassigendDrivers(id);
            const response = [];
            if (resp.length !== 0) {
                for (const driver of resp) {
                    const respObj = {};
                    respObj.id = driver.id;
                    respObj.firstName = driver.firstName;
                    respObj.lastName = driver.lastName;
                    respObj.address = driver.address;
                    respObj.phoneNumber = driver.phoneNumber;
                    respObj.email = driver.email;
                    respObj.photoUrl = driver.photoUrl;
                    respObj.licenseUrl = driver.licenseUrl;
                    respObj.heavyVehicleLic = driver.heavyVehicleLic;
                    response.push(respObj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getUnssignedVehicles(id, res) {
        try {
            const resp = await this.ownerService.getUnassigendVehicles(id);
            const response = [];
            if (resp.length !== 0) {
                for (const vehicle of resp) {
                    const respObj = {};
                    respObj.id = vehicle.id;
                    respObj.type = vehicle.type;
                    respObj.regNo = vehicle.regNo;
                    respObj.preferredArea = vehicle.preferredArea;
                    respObj.capacity = vehicle.capacity;
                    respObj.capacityUnit = vehicle.capacityUnit;
                    respObj.photoUrl = vehicle.photoUrl;
                    respObj.heavyVehicle = vehicle.heavyVehicle;
                    response.push(respObj);
                }
            }
            return res.json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async unassignDriver(id, res) {
        try {
            await this.ownerService.unassignDriver(id);
            return res.status(common_1.HttpStatus.OK).json("Driver successfully unassigned");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getMyBookings(id, res) {
        try {
            const bookings = await this.bookingService.getBookingsByOwner(id);
            const response = [];
            if (bookings.length !== 0) {
                for (const b of bookings) {
                    const booking = {};
                    booking.id = b.id;
                    booking.createdAt = b.createdAt;
                    booking.bookingDate = b.bookingDate;
                    booking.pickupTime = b.pickupTime;
                    booking.startLong = b.startLong;
                    booking.startLat = b.startLat;
                    booking.destLong = b.destLong;
                    booking.destLat = b.destLat;
                    booking.avgHandlingTime = b.avgHandlingTime;
                    booking.loadingTime = b.loadingTime;
                    booking.unloadingTime = b.unloadingTime;
                    booking.travellingTime = b.travellingTime;
                    booking.vehicleCharge = b.vehicleCharge;
                    booking.serviceCharge = b.serviceCharge;
                    booking.loadingCapacity = b.loadingCapacity;
                    booking.isReturnTrip = b.isReturnTrip;
                    booking.willingToShare = b.willingToShare;
                    booking.vehicleId = b.vehicle.id;
                    const customer = {};
                    customer.firstName = b.customer.firstName;
                    customer.lastName = b.customer.lastName;
                    customer.mobileNum = b.customer.mobileNum;
                    booking.customer = customer;
                    response.push(booking);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getDriverVehicles(id, res) {
        try {
            const resp = await this.ownerService.getDriverVehicles(id);
            const response = {};
            if (!resp)
                return res.status(common_1.HttpStatus.NOT_FOUND).json("No any assigned drivers and vehicles");
            const driver = {};
            const vehicle = {};
            driver.id = resp.driver.id;
            driver.firstName = resp.driver.firstName;
            driver.lastName = resp.driver.lastName;
            driver.phoneNumber = resp.driver.phoneNumber;
            driver.email = resp.driver.email;
            driver.photoUr = resp.driver.photoUrl;
            vehicle.id = resp.vehicle.id;
            vehicle.type = resp.vehicle.type;
            vehicle.regNo = resp.vehicle.regNo;
            vehicle.preferredArea = resp.vehicle.preferredArea;
            vehicle.capacity = resp.vehicle.capacity;
            vehicle.capacityUnit = resp.vehicle.capacityUnit;
            vehicle.photoUrl = resp.vehicle.photoUrl;
            vehicle.chargePerKm = resp.vehicle.chargePerKm;
            vehicle.heavyVehicle = resp.vehicle.heavyVehicle;
            response.driver = driver;
            response.vehicle = vehicle;
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getDrivers(id, res) {
        try {
            const resp = await this.ownerService.getDrivers(id);
            const response = [];
            if (resp.length !== 0) {
                for (const dr of resp) {
                    const driver = {};
                    driver.id = dr.id;
                    driver.firstName = dr.firstName;
                    driver.lastName = dr.lastName;
                    driver.phoneNumber = dr.phoneNumber;
                    driver.email = dr.email;
                    driver.address = dr.address;
                    driver.heavyVehicleLic = dr.heavyVehicleLic;
                    driver.licenseUrl = dr.licenseUrl;
                    driver.photoUrl = dr.photoUrl;
                    driver.enabled = dr.enabled;
                    response.push(driver);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async disableDriver(id, res) {
        try {
            const resp = await this.ownerService.disableDriver(id);
            if (resp.id)
                return res.status(common_1.HttpStatus.OK).json(resp);
            return res.status(common_1.HttpStatus.CONFLICT).json("Driver has assigned vehicle");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async enableDriver(id, res) {
        try {
            const resp = await this.ownerService.enableDriver(id);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async changeDriverPassword(passwordReq, id, res) {
        try {
            const resp = await this.ownerService.changePassword(id, passwordReq);
            if (resp) {
                return res.status(common_1.HttpStatus.OK).json("Password changed successfully");
            }
            return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Old password mismatched");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getWalletData(id, res) {
        try {
            const resp = await this.ownerService.getWalletData(id);
            if (resp) {
                return res.status(common_1.HttpStatus.OK).json(resp);
            }
            return res.status(common_1.HttpStatus.NOT_FOUND).json("Wallet not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async createBankAccount(id, bankReq, res) {
        try {
            const resp = await this.ownerService.createBankAccount(id, bankReq);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async makeWithdrawal(id, withdrawalReq, res) {
        try {
            const resp = await this.ownerService.makeWithdrawal(id, withdrawalReq);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async checkBankAcc(id, res) {
        try {
            const resp = await this.ownerService.checkBankAcc(id);
            if (resp) {
                const commonRes = new common_res_1.CommonRes();
                commonRes.id = resp.id;
                return res.status(common_1.HttpStatus.OK).json(commonRes);
            }
            return res.status(common_1.HttpStatus.ACCEPTED).json("Bank account not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getRewards(id, res) {
        try {
            const ownerRewards = [];
            const resp = await this.ownerService.getRewards(id);
            if (resp.length !== 0) {
                for (const r of resp) {
                    const respObj = new ownerRewards_req_1.OwnerRewardsReq();
                    respObj.id = r.id;
                    respObj.date = r.date;
                    respObj.isClaimed = r.isClaimed;
                    respObj.rewardAmount = r.rewardAmount;
                    ownerRewards.push(respObj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(ownerRewards);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getProfile(id, res) {
        try {
            const resp = await this.ownerService.getProfile(id);
            const profile = new profile_res_1.ProfileRes();
            profile.firstName = resp.firstName;
            profile.lastName = resp.lastName;
            profile.address = resp.address;
            profile.nic = resp.nic;
            profile.phoneNo = resp.mobNumber;
            profile.email = resp.email;
            profile.profilePic = resp.profilePic;
            return res.status(common_1.HttpStatus.OK).json(profile);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async updateProfile(profileUpdate, id, res) {
        try {
            const resp = await this.ownerService.updateProfile(id, profileUpdate);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getDriversBookingCount(id, res) {
        try {
            const resp = await this.bookingService.getDriversBookingCount(id);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getNotifications(id, res) {
        try {
            const response = [];
            const resp = await this.ownerService.getNotifications(id);
            if (resp.length !== 0) {
                for (const n of resp) {
                    const notifyObj = new notification_res_1.NotificationRes();
                    notifyObj.id = n.id;
                    notifyObj.timeStamp = n.date;
                    notifyObj.title = n.title;
                    notifyObj.message = n.message;
                    response.push(notifyObj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getOwnerRates(ownerId, res) {
        try {
            const resp = await this.bookingService.getOwnerRates(ownerId);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
};
exports.OwnerController = OwnerController;
__decorate([
    (0, common_1.Post)('tempCreate'),
    (0, swagger_1.ApiBody)({ type: owner_dto_1.OwnerDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Owner succefully created" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "create vehicel owner temporarily" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [owner_dto_1.OwnerDto, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "tempCreate", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Signin response", type: signin_res_1.SignInResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Owner not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "owner signin" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('emailAvailability/:email'),
    (0, swagger_1.ApiParam)({
        name: "email",
        required: true,
        type: String,
        description: "owner entered email address"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Email not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: "Email exist" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "check availability of the owner email" }),
    __param(0, (0, common_1.Param)("email")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "emailAvailability", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('createDriver'),
    (0, swagger_1.ApiBody)({ type: driver_dto_1.DriverDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Driver succefully created" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "create driver temporarily" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_dto_1.DriverDto, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "createDriver", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('createVehicle'),
    (0, swagger_1.ApiBody)({ type: vehicle_dto_1.VehicleDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Vehicle succefully created" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "create vehicle temporarily" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_dto_1.VehicleDto, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "createVehile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('assignDriver'),
    (0, swagger_1.ApiBody)({ type: assignDriver_req_1.AssignDriverReq }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Assigned ID", type: assignDriver_res_1.AssignDriverRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "assign driver to the vehicle" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assignDriver_req_1.AssignDriverReq, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "assignDriver", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('assignedDrivers/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of assigned drivers" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the assigned drivers by owner ID" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getAssignedDrivers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('unassignedDrivers/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of unassigned drivers" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the unassigned drivers by owner ID" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getUnssignedDrivers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('unassignedVehi/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of unassigned vehicles" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the unassigned vehicles by owner ID" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getUnssignedVehicles", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)('unassignDriver/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "assign Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Driver successfully unassigned" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "unassign driver from the vehicle" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "unassignDriver", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('myBookings/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Get list of owner's bookings" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get owner's bookings" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('driverVehicles/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Vehicle with assigned driver" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "No any assigned drivers and vehicles" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get vehicle with assgined driver" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "vehicle Id"
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getDriverVehicles", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('drivers/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "owner's drivers list" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get drivers by owner" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getDrivers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)("disableDriver/:id"),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "disabled driver id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: "Driver has assigned vehicle" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "disable driver" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "driver id"
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "disableDriver", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)("enableDriver/:id"),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "enabled driver id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "enable driver" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "driver id"
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "enableDriver", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('password/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Password changed successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "change owner password" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changePassword_req_1.ChangePasswordReq, String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "changeDriverPassword", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('wallet/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Owner wallet data", type: wallet_res_1.WalletRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Wallet not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get owner's wallet and transactions data" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getWalletData", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('bankAccount/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Wallet Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "create owner's bank account" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bankAcc_req_1.BankAccReq, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "createBankAccount", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('makeWithdrawal/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'wallet Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Transaction Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "make a withdrawal" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, withdrawal_req_1.WithdrawalReq, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "makeWithdrawal", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('bankAccAvailability/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Wallet Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "Bank account not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "check availability of bank account" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "checkBankAcc", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('rewards/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of rewards", type: [ownerRewards_req_1.OwnerRewardsReq] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "owner's rewards" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getRewards", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('profile/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Profile data", type: profile_res_1.ProfileRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get owner's profile" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('profile/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Profile id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "update owner's profile" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateProfile_req_1.UpdateProfileReq, String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('driverBookings/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of drivers and bookings count", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get drivers and their completed bookings count" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getDriversBookingCount", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('notification/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of notifications", type: [notification_res_1.NotificationRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get notifications by owner id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('rates/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "owner rates" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get rates by owner id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getOwnerRates", null);
exports.OwnerController = OwnerController = __decorate([
    (0, swagger_1.ApiTags)("vehicle owner"),
    (0, common_1.Controller)('owner'),
    __metadata("design:paramtypes", [owner_service_1.OwnerService,
        common_service_1.CommonService,
        driver_service_1.DriverService,
        vehicle_service_1.VehicleService,
        auth_service_1.AuthService,
        booking_service_1.BookingService])
], OwnerController);
//# sourceMappingURL=owner.controller.js.map