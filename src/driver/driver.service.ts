import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { TempDriver } from './entities/tempDriver.entity';
import { DriverDto } from './dtos/driver.dto';
import { CommonService } from 'src/common/common.service';
import { Owner } from 'src/owner/entities/owner.entity';
import { DriverVehicle } from './entities/driver.vehicle.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Booking } from 'src/booking/enities/booking.entity';
import { SharedBooking } from 'src/booking/enities/sharedBooking.entity';
import { RideStartReq } from './requests/rideStart.req';
import { RideGateway } from 'src/gateways/ride.gateways';
import { SendCoordReq } from './requests/sendCoord.req';
import { RideStopReq } from './requests/rideStop.req';
import { ChangePasswordReq } from '../common/requests/changePassword.req';
import { UpdateProfileReq } from 'src/common/requests/updateProfile.req';
import { CustomerNotification } from 'src/customer/entities/customerNotification.entity';
import { DriverNotification } from './entities/driverNotification.entity';

@Injectable()
export class DriverService {
    constructor(
        @InjectRepository(Driver) private driverRepo: Repository<Driver>,
        @InjectRepository(TempDriver) private tempDriverRepo: Repository<TempDriver>,
        @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
        @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
        @InjectRepository(DriverVehicle) private driverVehiRepo: Repository<DriverVehicle>,
        @InjectRepository(SharedBooking) private sharedBookingRepo: Repository<SharedBooking>,
        @InjectRepository(DriverNotification) private notificationRepo: Repository<DriverNotification>,
        private readonly commonService: CommonService,
        private readonly rideGateway: RideGateway
    ) { }

    //create driver
    async tempCreate(driverDto: DriverDto): Promise<Driver> {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: driverDto.ownerId
            }
        });
        const driver = new Driver();
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

        return await this.tempDriverRepo.save(driver)
    }

    //Driver's email availability
    async emailAvilability(email: string) {
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
        if (driver || tempDriver) return true;

        return false;
    }

    //Signin driver
    async signin(email: string): Promise<Driver> {
        return await this.driverRepo.findOne({
            where: {
                email: email,
                deleted: false
            }
        });
    }

    //Get assigned vehicle
    async getAssignedVehicle(id: string): Promise<Vehicle> {
        const driverVehicle = await this.driverVehiRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.driverId = :id", { id: id })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getOne()

        return driverVehicle.vehicle;
    }

    //Get driver's booking
    async getBookings(vehicle: Vehicle): Promise<Booking[]> {
        return await this.bookingRepo.find({
            where: {
                vehicle: vehicle,
                status: Not('cancelled'),
                advancePayment: Not(IsNull()),
                isCancelled: false
            },
            order: {
                bookingDate: 'ASC'
            }
        })
    }

    //Get drivers original cancelled shared bookings
    async getSharedBookings(vehicle: Vehicle): Promise<SharedBooking[]> {
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

    //Get driver's shared booking by booking id
    async getSharedBooking(bookingId: string): Promise<SharedBooking[]> {
        const booking = await this.bookingRepo.findOne({
            where: {
                id: bookingId,
                isCancelled: false,
                advancePayment: Not(IsNull())
            },
        });
        return await this.sharedBookingRepo.createQueryBuilder("sharedBookings")
            .where("sharedBookings.bookingId = :bookingId", { bookingId: booking.id })
            .andWhere("sharedBookings.isCancelled = :isCancelled", { isCancelled: false })
            .andWhere("sharedBookings.advancePaymentId IS NOT NULL")
            .andWhere("sharedBookings.status = :status", { status: 'upcoming' })
            .getMany();
    }

    //Start ride
    async startRide(rideStartReq: RideStartReq): Promise<any> {
        const driver = await this.driverRepo.findOne({
            where: {
                id: rideStartReq.id
            }
        });

        let booking: Booking | SharedBooking;
        const gatewayData: SendCoordReq = new SendCoordReq();
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
        } else {
            booking = await this.sharedBookingRepo.findOne({
                where: {
                    id: rideStartReq.bookingId
                },
                relations: ["customer"]
            })
            gatewayData.bookingId = booking.id;
        };
        this.rideGateway.sendCoordinates(gatewayData);
        return { booking: booking, driver: driver };
    }

    //Stop ride
    async stopRide(driverId: string, rideStopReq: RideStopReq) {
        const driver = await this.driverRepo.findOne({
            where: {
                id: driverId
            }
        });

        let booking: Booking | SharedBooking;
        if (rideStopReq.bookingType === 'original') {
            booking = await this.bookingRepo.findOne({
                where: {
                    id: rideStopReq.bookingId
                },
                relations: ["customer"]
            })
        } else {
            booking = await this.sharedBookingRepo.findOne({
                where: {
                    id: rideStopReq.bookingId
                },
                relations: ["customer"]
            })
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

    //Change password
    async changePassword(id: string, passwordReq: ChangePasswordReq): Promise<Driver> {
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

    //Get driver profile
    async getProfile(id: string): Promise<Driver> {
        return await this.driverRepo.findOne({
            where: {
                id: id
            }
        })
    }

    //Update profile
    async updateProfile(id: string, updateReq: UpdateProfileReq): Promise<Driver> {
        const driver = await this.driverRepo.findOne({
            where: {
                id: id
            }
        });

        driver.phoneNumber = updateReq.mobileNo;
        driver.photoUrl = updateReq.profilePic;

        return await this.driverRepo.save(driver);
    }

    //Get drver notifications
    async getNotifications(id: string) {
        return await this.notificationRepo.createQueryBuilder("notification")
            .where('notification.driverId = :driverId', { driverId: id })
            .orderBy('notification.date', 'DESC')
            .getMany();
    }
}
