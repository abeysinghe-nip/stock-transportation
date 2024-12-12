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
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nodemailer = require("nodemailer");
require('dotenv').config();
const bcrypt = require("bcrypt");
const booking_entity_1 = require("../booking/enities/booking.entity");
const sharedBooking_entity_1 = require("../booking/enities/sharedBooking.entity");
const bookingComplete_res_1 = require("../driver/responses/bookingComplete.res");
const typeorm_2 = require("typeorm");
const otpGenerator = require("otp-generator");
const customerOtp_entity_1 = require("./entities/customerOtp.entity");
const ownerOtp_entity_1 = require("./entities/ownerOtp.entity");
const driverOtp_entity_1 = require("./entities/driverOtp.entity");
const customer_entity_1 = require("../customer/entities/customer.entity");
const owner_entity_1 = require("../owner/entities/owner.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const moment = require("moment");
const customerFeedback_entity_1 = require("./entities/customerFeedback.entity");
let CommonService = class CommonService {
    constructor(bookingRepo, sharedBookingRepo, customerOtpRepo, ownerOtpRepo, driverOtpRepo, customerRepo, ownerRepo, driverRepo, feedbackRepo) {
        this.bookingRepo = bookingRepo;
        this.sharedBookingRepo = sharedBookingRepo;
        this.customerOtpRepo = customerOtpRepo;
        this.ownerOtpRepo = ownerOtpRepo;
        this.driverOtpRepo = driverOtpRepo;
        this.customerRepo = customerRepo;
        this.ownerRepo = ownerRepo;
        this.driverRepo = driverRepo;
        this.feedbackRepo = feedbackRepo;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PW
            }
        });
    }
    async calPaymentSummery(bookingId, bookingType) {
        if (bookingType === 'original') {
            const booking = await this.bookingRepo.findOne({
                where: {
                    id: bookingId
                },
                relations: ['advancePayment']
            });
            const sharedBooking = await this.sharedBookingRepo
                .createQueryBuilder('sharedBooking')
                .leftJoinAndSelect('sharedBooking.advancePayment', 'advancePayment')
                .where('sharedBooking.bookingId = :bookingId', { bookingId: booking.id })
                .andWhere('sharedBooking.isCancelled = :isCancelled', { isCancelled: false })
                .andWhere('sharedBooking.advancePaymentId IS NOT NULL')
                .getOne();
            const resp = new bookingComplete_res_1.BookingCompleteRes();
            resp.vehicleCharge = parseFloat(booking.vehicleCharge.toFixed(2));
            resp.serviceCharge = parseFloat(booking.serviceCharge.toFixed(2));
            resp.handlingCharge = parseFloat(((booking.loadingTime / 60 + booking.unloadingTime / 60) * 3).toFixed(2));
            resp.total = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge).toFixed(2));
            resp.advancePayment = parseFloat(booking.advancePayment.amount.toFixed(2));
            if (sharedBooking) {
                resp.balPayment = parseFloat((booking.vehicleCharge * booking.loadingCapacity + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
                resp.sharedDiscount = ((1 - booking.loadingCapacity) * 100).toFixed(2) + '%';
            }
            else {
                resp.balPayment = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
                resp.sharedDiscount = '0%';
            }
            return resp;
        }
        const sharedBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: bookingId,
            },
            relations: ['booking', 'advancePayment']
        });
        const resp = new bookingComplete_res_1.BookingCompleteRes();
        resp.vehicleCharge = parseFloat(sharedBooking.vehicleCharge.toFixed(2));
        resp.serviceCharge = parseFloat(sharedBooking.serviceCharge.toFixed(2));
        resp.handlingCharge = parseFloat(((sharedBooking.loadingTime / 60 + sharedBooking.unloadingTime / 60) * 3).toFixed(2));
        resp.total = parseFloat((sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge).toFixed(2));
        resp.advancePayment = parseFloat((sharedBooking.advancePayment.amount).toFixed(2));
        if (sharedBooking.booking.isCancelled) {
            resp.total = parseFloat((sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
                .toFixed(2));
            resp.sharedDiscount = '0%';
        }
        else {
            resp.balPayment = parseFloat((sharedBooking.vehicleCharge * (1 - sharedBooking.booking.loadingCapacity) +
                sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
                .toFixed(2));
            resp.sharedDiscount = (sharedBooking.booking.loadingCapacity * 100).toFixed(2) + '%';
        }
        return resp;
    }
    async sendNotifications(email, subject, message) {
        const mailDetails = {
            name: 'Gulf Transportation Solution',
            from: 'gulftransportationsolution@gmail.com',
            to: email,
            subject: subject,
            html: message
        };
        this.transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            }
        });
        return await this.transporter.sendMail(mailDetails);
    }
    async passwordEncrypt(password) {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
        return;
    }
    async passwordDecrypt(hash, password) {
        return await bcrypt.compare(password, hash);
        return;
    }
    async genarateOtp(userEmail, userType) {
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        switch (userType) {
            case 'customer':
                const customer = await this.customerRepo.findOne({
                    where: {
                        email: userEmail
                    }
                });
                const customerOtp = new customerOtp_entity_1.CustomerOtp();
                customerOtp.createdAt = new Date();
                customerOtp.otp = await this.passwordEncrypt(otp);
                customerOtp.customer = customer;
                await this.customerOtpRepo.save(customerOtp);
                return {
                    otp: otp,
                    id: customer.id,
                    email: customer.email,
                    firstName: customer.firstName,
                    lastName: customer.lastName
                };
            case 'owner':
                const owner = await this.ownerRepo.findOne({
                    where: {
                        email: userEmail
                    }
                });
                const ownerOtp = new ownerOtp_entity_1.OwnerOtp();
                ownerOtp.createdAt = new Date();
                ownerOtp.otp = await this.passwordEncrypt(otp);
                ownerOtp.owner = owner;
                await this.ownerOtpRepo.save(ownerOtp);
                return {
                    otp: otp,
                    id: owner.id,
                    email: owner.email,
                    firstName: owner.firstName,
                    lastName: owner.lastName
                };
            default:
                const driver = await this.driverRepo.findOne({
                    where: {
                        email: userEmail
                    }
                });
                const driverOtp = new driverOtp_entity_1.DriverOtp();
                driverOtp.createdAt = new Date();
                driverOtp.otp = await this.passwordEncrypt(otp);
                driverOtp.driver = driver;
                await this.driverOtpRepo.save(driverOtp);
                return {
                    otp: otp,
                    id: driver.id,
                    email: driver.email,
                    firstName: driver.firstName,
                    lastName: driver.lastName,
                };
        }
    }
    async verifyOtp(userType, userId, otp, res) {
        switch (userType) {
            case 'customer':
                const customertOtp = await this.customerOtpRepo.createQueryBuilder("otp")
                    .where("otp.customerId = :customerId", { customerId: userId })
                    .orderBy("otp.createdAt", "DESC")
                    .getOne();
                var isFiveMinsBefore = await this.checkOtpExpired(customertOtp.createdAt);
                if (isFiveMinsBefore) {
                    return res.status(common_1.HttpStatus.FORBIDDEN).json("OTP expired");
                }
                var isMatched = await this.passwordDecrypt(customertOtp.otp, otp.otp);
                if (isMatched) {
                    return res.status(common_1.HttpStatus.OK).json("OTP verified");
                }
                return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Invalid OTP");
            case 'owner':
                const ownerOtp = await this.ownerOtpRepo.createQueryBuilder("otp")
                    .where("otp.ownerId = :ownerId", { ownerId: userId })
                    .orderBy('otp.createdAt', 'DESC')
                    .getOne();
                var isFiveMinsBefore = await this.checkOtpExpired(ownerOtp.createdAt);
                if (isFiveMinsBefore) {
                    return res.status(common_1.HttpStatus.FORBIDDEN).json("OTP expired");
                }
                var isMatched = await this.passwordDecrypt(ownerOtp.otp, otp.otp);
                if (isMatched) {
                    return res.status(common_1.HttpStatus.OK).json("OTP verified");
                }
                return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Invalid OTP");
            default:
                const driverOtp = await this.driverOtpRepo.createQueryBuilder("otp")
                    .where("otp.driverId = :driverId", { driverId: userId })
                    .orderBy('otp.createdAt', 'DESC')
                    .getOne();
                var isFiveMinsBefore = await this.checkOtpExpired(driverOtp.createdAt);
                if (isFiveMinsBefore) {
                    return res.status(common_1.HttpStatus.FORBIDDEN).json("OTP expired");
                }
                var isMatched = await this.passwordDecrypt(driverOtp.otp, otp.otp);
                if (isMatched) {
                    return res.status(common_1.HttpStatus.OK).json("OTP verified");
                }
                return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Invalid OTP");
        }
    }
    async changePassword(userId, userType, password) {
        let user;
        switch (userType) {
            case 'customer':
                const customer = await this.customerRepo.findOne({
                    where: {
                        id: userId
                    }
                });
                customer.password = await this.passwordEncrypt(password.password);
                return await this.customerRepo.save(customer);
            case 'owner':
                const owner = await this.ownerRepo.findOne({
                    where: {
                        id: userId
                    }
                });
                owner.password = await this.passwordEncrypt(password.password);
                return await this.ownerRepo.save(owner);
            default:
                const driver = await this.driverRepo.findOne({
                    where: {
                        id: userId
                    }
                });
                driver.password = await this.passwordEncrypt(password.password);
                return await this.driverRepo.save(driver);
        }
    }
    async getFeedbacks() {
        return await this.feedbackRepo.find({
            where: {
                isApproved: true
            },
            order: {
                createdAt: 'DESC'
            },
            relations: ["customer"]
        });
    }
    async checkOtpExpired(createdAt) {
        const fiveMinBefore = moment().subtract(5, 'minutes');
        return moment(createdAt).isBefore(fiveMinBefore);
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(sharedBooking_entity_1.SharedBooking)),
    __param(2, (0, typeorm_1.InjectRepository)(customerOtp_entity_1.CustomerOtp)),
    __param(3, (0, typeorm_1.InjectRepository)(ownerOtp_entity_1.OwnerOtp)),
    __param(4, (0, typeorm_1.InjectRepository)(driverOtp_entity_1.DriverOtp)),
    __param(5, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(6, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(7, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(8, (0, typeorm_1.InjectRepository)(customerFeedback_entity_1.CustomerFeedback)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommonService);
//# sourceMappingURL=common.service.js.map