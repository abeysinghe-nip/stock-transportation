import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
const nodemailer = require("nodemailer");
require('dotenv').config();
import * as bcrypt from 'bcrypt';
import { Booking } from "src/booking/enities/booking.entity";
import { SharedBooking } from "src/booking/enities/sharedBooking.entity";
import { BookingCompleteRes } from "src/driver/responses/bookingComplete.res";
import { Repository } from "typeorm";
import * as otpGenerator from "otp-generator";
import { CustomerOtp } from "./entities/customerOtp.entity";
import { OwnerOtp } from "./entities/ownerOtp.entity";
import { DriverOtp } from "./entities/driverOtp.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Owner } from "src/owner/entities/owner.entity";
import { Driver } from "src/driver/entities/driver.entity";
import { OtpReq } from "./requests/otp.req";
import * as moment from "moment";
import { Response } from "express";
import { Password } from "./requests/password.req";
import { CustomerFeedback } from "./entities/customerFeedback.entity";

@Injectable()
export class CommonService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,
        @InjectRepository(SharedBooking)
        private sharedBookingRepo: Repository<SharedBooking>,
        @InjectRepository(CustomerOtp)
        private customerOtpRepo: Repository<CustomerOtp>,
        @InjectRepository(OwnerOtp)
        private ownerOtpRepo: Repository<OwnerOtp>,
        @InjectRepository(DriverOtp)
        private driverOtpRepo: Repository<DriverOtp>,
        @InjectRepository(Customer)
        private customerRepo: Repository<Customer>,
        @InjectRepository(Owner)
        private ownerRepo: Repository<Owner>,
        @InjectRepository(Driver)
        private driverRepo: Repository<Driver>,
        @InjectRepository(CustomerFeedback)
        private feedbackRepo: Repository<CustomerFeedback>
    ) { }


    async calPaymentSummery(bookingId: string, bookingType: string): Promise<BookingCompleteRes> {
        if (bookingType === 'original') {
            const booking = await this.bookingRepo.findOne({
                where: {
                    id: bookingId
                },
                relations: ['advancePayment']
            });

            //Check shared booking available or not
            const sharedBooking = await this.sharedBookingRepo
                .createQueryBuilder('sharedBooking')
                .leftJoinAndSelect('sharedBooking.advancePayment', 'advancePayment')
                .where('sharedBooking.bookingId = :bookingId', { bookingId: booking.id })
                .andWhere('sharedBooking.isCancelled = :isCancelled', { isCancelled: false })
                .andWhere('sharedBooking.advancePaymentId IS NOT NULL')
                .getOne();

            const resp: BookingCompleteRes = new BookingCompleteRes();
            resp.vehicleCharge = parseFloat(booking.vehicleCharge.toFixed(2));
            resp.serviceCharge = parseFloat(booking.serviceCharge.toFixed(2));
            resp.handlingCharge = parseFloat(((booking.loadingTime / 60 + booking.unloadingTime / 60) * 3).toFixed(2)); //Handling fee is Rs.3 per min
            resp.total = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge).toFixed(2));
            resp.advancePayment = parseFloat(booking.advancePayment.amount.toFixed(2));

            if (sharedBooking) {
                resp.balPayment = parseFloat((booking.vehicleCharge * booking.loadingCapacity + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
                resp.sharedDiscount = ((1 - booking.loadingCapacity) * 100).toFixed(2) + '%';
            } else {
                resp.balPayment = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
                resp.sharedDiscount = '0%';
            }
            return resp;
        }

        //If booking type "shared"
        const sharedBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: bookingId,
            },
            relations: ['booking', 'advancePayment']
        });

        const resp: BookingCompleteRes = new BookingCompleteRes();
        resp.vehicleCharge = parseFloat(sharedBooking.vehicleCharge.toFixed(2));
        resp.serviceCharge = parseFloat(sharedBooking.serviceCharge.toFixed(2));
        resp.handlingCharge = parseFloat(((sharedBooking.loadingTime / 60 + sharedBooking.unloadingTime / 60) * 3).toFixed(2)); //Handling fee is Rs.3 per min
        resp.total = parseFloat((sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge).toFixed(2));
        resp.advancePayment = parseFloat((sharedBooking.advancePayment.amount).toFixed(2));

        //Check orgignal booking is cancel or not
        if (sharedBooking.booking.isCancelled) {
            resp.total = parseFloat(
                (sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
                    .toFixed(2)
            );
            resp.sharedDiscount = '0%';
        } else {
            resp.balPayment = parseFloat(
                (sharedBooking.vehicleCharge * (1 - sharedBooking.booking.loadingCapacity) +
                    sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
                    .toFixed(2)
            );
            resp.sharedDiscount = (sharedBooking.booking.loadingCapacity * 100).toFixed(2) + '%';
        }
        return resp;
    }

    //send email notification
    public async sendNotifications(email: string, subject: string, message: string) {
        const mailDetails = {
            name: 'Gulf Transportation Solution',
            from: 'gulftransportationsolution@gmail.com',
            to: email,
            subject: subject,
            html: message
        }

        this.transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                return HttpStatus.INTERNAL_SERVER_ERROR;
            }
        })

        return await this.transporter.sendMail(mailDetails);
    }

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW
        }
    })

    //Hash password
    async passwordEncrypt(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
        return;
    }

    //Decrypt password
    async passwordDecrypt(hash: string, password: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
        return;
    }

    //genarate otp
    async genarateOtp(userEmail: string, userType: string): Promise<any> {
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        switch (userType) {
            case 'customer':
                const customer = await this.customerRepo.findOne({
                    where: {
                        email: userEmail
                    }
                })
                const customerOtp: CustomerOtp = new CustomerOtp();
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
                })
                const ownerOtp: OwnerOtp = new OwnerOtp();
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
                })
                const driverOtp: DriverOtp = new DriverOtp();
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

    //verify otp
    async verifyOtp(userType: string, userId: string, otp: OtpReq, res: Response) {
        switch (userType) {
            case 'customer':
                const customertOtp = await this.customerOtpRepo.createQueryBuilder("otp")
                    .where("otp.customerId = :customerId", { customerId: userId })
                    .orderBy("otp.createdAt", "DESC")
                    .getOne();

                var isFiveMinsBefore: boolean = await this.checkOtpExpired(customertOtp.createdAt);

                //Checl whether OTP is expierd
                if (isFiveMinsBefore) {
                    return res.status(HttpStatus.FORBIDDEN).json("OTP expired");
                }

                //If not expired verify OTP
                var isMatched = await this.passwordDecrypt(customertOtp.otp, otp.otp);
                if (isMatched) {
                    return res.status(HttpStatus.OK).json("OTP verified");
                }

                return res.status(HttpStatus.NOT_ACCEPTABLE).json("Invalid OTP");
            case 'owner':
                const ownerOtp = await this.ownerOtpRepo.createQueryBuilder("otp")
                    .where("otp.ownerId = :ownerId", { ownerId: userId })
                    .orderBy('otp.createdAt', 'DESC')
                    .getOne();

                var isFiveMinsBefore = await this.checkOtpExpired(ownerOtp.createdAt);

                //Checl whether OTP is expierd
                if (isFiveMinsBefore) {
                    return res.status(HttpStatus.FORBIDDEN).json("OTP expired");
                }

                //If not expired verify OTP
                var isMatched = await this.passwordDecrypt(ownerOtp.otp, otp.otp);
                if (isMatched) {
                    return res.status(HttpStatus.OK).json("OTP verified");
                }

                return res.status(HttpStatus.NOT_ACCEPTABLE).json("Invalid OTP");
            default:
                const driverOtp = await this.driverOtpRepo.createQueryBuilder("otp")
                    .where("otp.driverId = :driverId", { driverId: userId })
                    .orderBy('otp.createdAt', 'DESC')
                    .getOne();

                var isFiveMinsBefore = await this.checkOtpExpired(driverOtp.createdAt);

                //Checl whether OTP is expierd
                if (isFiveMinsBefore) {
                    return res.status(HttpStatus.FORBIDDEN).json("OTP expired");
                }

                //If not expired verify OTP
                var isMatched = await this.passwordDecrypt(driverOtp.otp, otp.otp);
                if (isMatched) {
                    return res.status(HttpStatus.OK).json("OTP verified");
                }

                return res.status(HttpStatus.NOT_ACCEPTABLE).json("Invalid OTP");
        }
    }

    //Change password of the user
    async changePassword(userId: string, userType: string, password: Password): Promise<Customer | Owner | Driver> {
        let user: Customer | Owner | Driver;
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
                })
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

    //Get approved feedbacks
    async getFeedbacks(): Promise<CustomerFeedback[]> {
        return await this.feedbackRepo.find({
            where: {
                isApproved: true
            },
            order: {
                createdAt: 'DESC'
            },
            relations: ["customer"]
        })
    }

    //-----------------------------private methods-----------------------------
    //Check time period that OTP issued
    private async checkOtpExpired(createdAt: Date): Promise<boolean> {
        const fiveMinBefore = moment().subtract(5, 'minutes');
        return moment(createdAt).isBefore(fiveMinBefore);
    }
}