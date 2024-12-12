import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Driver } from 'src/driver/entities/driver.entity';
import { TempDriver } from 'src/driver/entities/tempDriver.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { TempOwner } from 'src/owner/entities/tempOwner.entity';
import { TempVehicle } from 'src/vehicle/entities/tempVehicle.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Not, Repository } from 'typeorm';
import { AdminDto } from './dtos/admin.dto';
import { Admin } from './entites/admin.entity';
import { HTML } from 'src/templates/html';
import * as generator from 'generate-password';
import { ChangePasswordReq } from 'src/common/requests/changePassword.req';
import { Booking } from 'src/booking/enities/booking.entity';
import { SharedBooking } from 'src/booking/enities/sharedBooking.entity';
import { CustomerFeedback } from 'src/common/entities/customerFeedback.entity';
import { OwnersRes } from './responses/owners.res';
import { DriversRes } from './responses/drivers.res';
import { CustomersRes } from './responses/customers.res';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(TempOwner) private tempOwnerRepo: Repository<TempOwner>,
        @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
        @InjectRepository(TempDriver) private tempDriverRepo: Repository<TempDriver>,
        @InjectRepository(Driver) private driverRepo: Repository<Driver>,
        @InjectRepository(TempVehicle) private tempVehicleRepo: Repository<TempVehicle>,
        @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
        @InjectRepository(Admin) private adminRepo: Repository<Admin>,
        @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
        @InjectRepository(SharedBooking) private sharedBookingRepo: Repository<SharedBooking>,
        @InjectRepository(CustomerFeedback) private feedbackRepo: Repository<CustomerFeedback>,
        @InjectRepository(Customer) private customerRepo: Repository<Customer>,
        private commonService: CommonService
    ) { }

    //Create admin
    async create(adminDto: AdminDto): Promise<Admin> {
        const admin: Admin = new Admin();
        admin.firstName = adminDto.firstName;
        admin.lastName = adminDto.lastName;
        admin.email = adminDto.email;
        admin.password = await this.commonService.passwordEncrypt(adminDto.password);

        return await this.adminRepo.save(admin);
    }

    //Admin signin
    async signin(email: string): Promise<Admin> {
        return await this.adminRepo.findOne({
            where: {
                email: email
            }
        })
    }

    //Get all the pending account creations of owners
    async getTempOwners(): Promise<TempOwner[]> {
        return await this.tempOwnerRepo.find();
    }

    //Accept owner account
    async acceptOwner(ownerId: string): Promise<Owner> {
        const tempOwner = await this.tempOwnerRepo.findOne({ where: { id: ownerId } });

        const owner = new Owner();
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

    //Reject owner account
    async rejectOwner(ownerId: string): Promise<TempOwner> {
        const owner = await this.tempOwnerRepo.findOne({ where: { id: ownerId } });
        await this.tempOwnerRepo.delete({ id: ownerId });
        return owner;
    }

    //Get all the pending account creations of owners
    async getTempDrivers(): Promise<TempDriver[]> {
        return await this.tempDriverRepo.find({ relations: ["owner"] });
    }

    //Accept driver account
    async acceptDriver(driverId: string): Promise<TempDriver> {
        const tempDriver = await this.tempDriverRepo.findOne({ where: { id: driverId }, relations: ["owner"] });

        const password = generator.generate({ length: 10, numbers: true })

        const driver = new Driver();
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

        const html: HTML = new HTML(driver.firstName, driver.lastName);
        const message = html.acceptDriverToDriver(driver.email, password);
        await this.commonService.sendNotifications(driver.email, 'Welcome to Gulf Transportation Solution! Your Driver Account is Ready', message);

        await this.driverRepo.save(driver);

        await this.tempDriverRepo.delete({ id: driverId });

        return tempDriver;
    }

    //Reject driver account
    async rejectDriver(driverId: string): Promise<TempDriver> {
        const driver = await this.tempDriverRepo.findOne({ where: { id: driverId }, relations: ["owner"] });
        await this.tempDriverRepo.delete({ id: driverId });

        return driver;
    }

    //Get all the vehicle creations of owners
    async getTempVehicles(): Promise<TempVehicle[]> {
        return await this.tempVehicleRepo.find({ relations: ["owner"] })
    }

    //Accept vehicle
    async acceptVehicle(vehicleId: string): Promise<TempVehicle> {
        const tempVehicle = await this.tempVehicleRepo.findOne({ where: { id: vehicleId }, relations: ["owner"] });

        const vehicle: Vehicle = new Vehicle();
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

    //Reject vehicle
    async rejectVehicle(vehicleId: string): Promise<TempVehicle> {
        const vehicle = await this.tempVehicleRepo.findOne({ where: { id: vehicleId }, relations: ["owner"] });
        await this.tempVehicleRepo.delete({ id: vehicleId });

        return vehicle;
    }

    //change password
    async changePassword(id: string, passwordReq: ChangePasswordReq): Promise<Admin> {
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

    //Get all the upcoming bookings
    async getBookings(): Promise<Booking[]> {
        return await this.bookingRepo.find({
            relations: ["sharedBooking", "balPayment", "advancePayment"]
        });
    }

    //Get all the feedbacks
    async getFeedbacks(): Promise<CustomerFeedback[]> {
        return await this.feedbackRepo.find({
            relations: ["customer"]
        });
    }

    //Approve feedback
    async approveFeedback(feedbackId: string): Promise<CustomerFeedback> {
        const feedback = await this.feedbackRepo.findOne({
            where: {
                id: feedbackId
            }
        });
        feedback.isApproved = true;
        return await this.feedbackRepo.save(feedback);
    }

    //Delete feedback
    async deleteFeedback(feedbackId: string): Promise<CustomerFeedback> {
        const feedback = await this.feedbackRepo.findOne({
            where: {
                id: feedbackId
            }
        });
        await this.feedbackRepo.delete({ id: feedbackId });
        return feedback;
    }

    //Get avilable owners
    async getOwners(): Promise<OwnersRes[]> {
        //Get all the owners
        const owners = await this.ownerRepo.find({
            relations: ["vehicles"]
        });

        //Get all the original bookings
        const bookings = await this.bookingRepo.find({
            where: {
                status: 'complete'
            },
            relations: ['vehicle']
        });

        //Get all the shared bookings
        const sharedBookings = await this.sharedBookingRepo.find({
            where: {
                status: 'complete'
            },
            relations: ['booking.vehicle']
        })

        const response: OwnersRes[] = [];
        if (owners.length !== 0) {
            for (const o of owners) {
                let originalBookingsCount: number = 0;
                let sharedBookingsCount: number = 0;
                const obj: OwnersRes = new OwnersRes();
                obj.id = o.id;
                obj.firstName = o.firstName;
                obj.lastName = o.lastName;
                obj.address = o.address;
                obj.nic = o.nic;
                obj.email = o.email;
                obj.mobNo = o.mobNumber;
                obj.gsCertiUrl = o.gsCertiUrl;
                //Check owner's completed original bookings and shared bookings
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

    //Get drivers by the owner
    async getDrivers(ownerId: string): Promise<DriversRes[]> {
        //Get drivers
        const drivers = await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :ownerId", { ownerId: ownerId })
            .andWhere("driver.deleted = :deleted", { deleted: false })
            .getMany();

        //Get all the original bookings
        const bookings = await this.bookingRepo.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.balPayment', 'balPayment')
            .leftJoinAndSelect('balPayment.driver', 'driver')
            .where('booking.status = :status', { status: 'complete' })
            .andWhere('booking.balPayment IS NOT NULL')
            .getMany();

        //Get all the shared bookings
        const sharedBookings = await this.sharedBookingRepo.createQueryBuilder('sBooking')
            .leftJoinAndSelect('sBooking.balPayment', 'balPayment')
            .leftJoinAndSelect('balPayment.driver', 'driver')
            .where('sBooking.status = :status', { status: 'complete' })
            .andWhere('sBooking.balPayment IS NOT NULL')
            .getMany()

        const response: DriversRes[] = [];

        if (drivers.length !== 0) {
            for (const d of drivers) {
                const obj: DriversRes = new DriversRes();
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

    //Get all the customers
    async getCustomers(): Promise<CustomersRes[]> {
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
        })

        const response: CustomersRes[] = [];

        if(customers.length !== 0) {
            for(const c of customers) {
                const obj: CustomersRes = new CustomersRes();
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
}