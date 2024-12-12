import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { TempOwnersDto } from './dtos/tempOwners.dto';
import { Response } from 'express';
import { CommonService } from 'src/common/common.service';
import { HTML } from 'src/templates/html';
import { AdminDto } from './dtos/admin.dto';
import { Admin } from './entites/admin.entity';
import { SignInResponse } from 'src/common/responses/signin.res';
import { SignInDto } from 'src/common/requests/signIn.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChangePasswordReq } from 'src/common/requests/changePassword.req';
import { Booking } from 'src/booking/enities/booking.entity';
import { BookingCountRes } from './responses/bookingCount.res';
import { BookingService } from 'src/booking/booking.service';
import { FeedbackRes } from './responses/feedback.res';
import { CommonRes } from 'src/common/responses/common.res';
import { OwnersRes } from './responses/owners.res';
import { DriversRes } from './responses/drivers.res';
import { CustomersRes } from './responses/customers.res';

@ApiTags("system admin")
@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private commonService: CommonService,
        private authService: AuthService,
        private bookingService: BookingService
    ) { }

    //Create admin
    @Post('create')
    @ApiBody({ type: AdminDto })
    @ApiResponse({ status: HttpStatus.OK, description: "Admin succefully created" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "create admin" })
    async create(@Body() adminDto: AdminDto, @Res() res: Response) {
        try {
            const admin: Admin = await this.adminService.create(adminDto);
            if (admin) {
                return res.status(HttpStatus.OK).json("Admin succefully created");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //admin signin
    @Post('signin')
    @ApiResponse({ status: HttpStatus.OK, description: "Signin response", type: SignInResponse })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Admin not found" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "admin signin" })
    async signin(@Body() signinDto: SignInDto, @Res() res: Response) {
        try {
            const admin = await this.adminService.signin(signinDto.userName);
            if (admin) {
                const isMatched = await this.commonService.passwordDecrypt(admin.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(admin.id, admin.email);
                    return res.status(HttpStatus.OK).json(access_token)
                }
                return res.status(HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(HttpStatus.NOT_FOUND).json("Admin not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all the pending account creations of owners
    @Get('getTempOwners')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "All the pending accounts of owners", type: [TempOwnersDto] })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Owners not found" })
    @ApiOperation({ summary: "get all the temporarily registered owners " })
    async getTempOwners(@Res() res: Response) {
        try {
            const tempOwners = await this.adminService.getTempOwners();
            if (tempOwners.length == 0) {
                return res.status(HttpStatus.NOT_FOUND).json("Owners not found");
            }

            //Response generate
            const response: TempOwnersDto[] = [];
            for (const to of tempOwners) {
                const ownerDto = new TempOwnersDto();
                ownerDto.id = to.id;
                ownerDto.firstName = to.firstName;
                ownerDto.lastName = to.lastName;
                ownerDto.address = to.address;
                ownerDto.nic = to.nic;
                ownerDto.email = to.email;
                ownerDto.mobNumber = to.mobNumber;
                ownerDto.gsCertiUrl = to.gsCertiUrl;
                response.push(ownerDto);
            }
            return res.status(HttpStatus.ACCEPTED).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Accept owner account
    @Post('acceptOwner/:id')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Accepted the owner" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiParam({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested owner"
    })
    @ApiOperation({ summary: "accept owner temporarily account by id" })
    async acceptOwner(@Param("id") id: string, @Res() res: Response) {
        try {
            const owner = await this.adminService.acceptOwner(id);

            //send notification via email
            const html: HTML = new HTML(owner.firstName, owner.lastName);
            const message: string = html.acceptOwner();
            await this.commonService.sendNotifications(owner.email, 'Your Account Has Been Accepted', message);

            return res.status(HttpStatus.ACCEPTED).json("Accepted the owner");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Reject owner account
    @Delete('rejectOwner/:id')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Rejected the owner" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiParam({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested owner"
    })
    @ApiOperation({ summary: "reject owner temporarily account by id" })
    async rejectOwner(@Param("id") id: string, @Res() res: Response) {
        try {
            const owner = await this.adminService.rejectOwner(id);

            const html: HTML = new HTML(owner.firstName, owner.lastName);
            const message: string = html.rejectOwner();
            await this.commonService.sendNotifications(owner.email, 'Your Account Registration Has Been Rejected', message);

            return res.status(HttpStatus.ACCEPTED).json("Rejected the owner");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all the pending account creations of drivers
    @Get('getTempDrivers')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "All the pending accounts of drivers" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Drivers not found" })
    @ApiOperation({ summary: "get all the temporarily registered drivers" })
    async getTempDrivers(@Res() res: Response) {
        try {
            const tempDrivers = await this.adminService.getTempDrivers();

            if (tempDrivers.length == 0) {
                return res.status(HttpStatus.NOT_FOUND).json("Drivers not found");
            }

            //Response generate
            const response = [];
            for (const driver of tempDrivers) {
                const driverObj: any = {};
                driverObj.id = driver.id;
                driverObj.firstName = driver.firstName;
                driverObj.lastName = driver.lastName;
                driverObj.email = driver.email;
                driverObj.phoneNumber = driver.phoneNumber
                driverObj.addres = driver.address;
                driverObj.policeCertiUrl = driver.policeCertiUrl;
                driverObj.licenseUrl = driver.licenseUrl;

                const ownerIdx = response.findIndex((owner: any) => owner.id == driver.owner.id);
                if (ownerIdx == -1) {
                    const owner: any = {};
                    owner.id = driver.owner.id;
                    owner.firstName = driver.owner.firstName;
                    owner.lastName = driver.owner.lastName;
                    owner.email = driver.owner.email;
                    owner.mobNumber = driver.owner.mobNumber;
                    owner.drivers = [driverObj];
                    response.push(owner)
                } else {
                    response[ownerIdx].drivers.push(driverObj);
                }
            }

            return res.status(HttpStatus.ACCEPTED).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Accept driver account
    @Post('acceptDriver/:id')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Accepted the driver" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiParam({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested driver"
    })
    @ApiOperation({ summary: "accept driver temporarily account by id" })
    async acceptDriver(@Param("id") id: string, @Res() res: Response) {
        try {
            const driver = await this.adminService.acceptDriver(id);

            const html: HTML = new HTML(driver.owner.firstName, driver.owner.lastName);
            const message: string = html.acceptDriver(driver.firstName, driver.lastName);
            await this.commonService.sendNotifications(driver.owner.email, `Driver ${driver.firstName} ${driver.lastName} Accepted and Registered Successfully.`, message);

            return res.status(HttpStatus.ACCEPTED).json("Accepted the driver");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Reject driver account
    @Delete('rejectDriver/:id')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Rejected the driver" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiParam({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested driver"
    })
    @ApiOperation({ summary: "reject driver temporarily account by id" })
    async rejectDriver(@Param("id") id: string, @Res() res: Response) {
        try {
            const driver = await this.adminService.rejectDriver(id);

            const html: HTML = new HTML(driver.owner.firstName, driver.owner.lastName);
            const message: string = html.rejectDriver(driver.firstName, driver.lastName);
            await this.commonService.sendNotifications(driver.owner.email, `Driver ${driver.firstName} ${driver.lastName} Rejected and Registeration Failed`, message);

            return res.status(HttpStatus.ACCEPTED).json("Rejected the driver");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all the pending creations of vehicles
    @Get('getTempVehicles')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "All the pending creations of vehicles" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Vehicles not found" })
    @ApiOperation({ summary: "get all the temporarily created vehicles" })
    async getTempVehicles(@Res() res: Response) {
        try {
            const tempVehicles = await this.adminService.getTempVehicles();

            if (tempVehicles.length == 0) {
                return res.status(HttpStatus.NOT_FOUND).json("Vehicles not found");
            }

            //Response generate
            const response = [];
            for (const vehicle of tempVehicles) {
                const vehicleObj: any = {};
                vehicleObj.id = vehicle.id;
                vehicleObj.type = vehicle.type;
                vehicleObj.regNo = vehicle.regNo;
                vehicleObj.preferredArea = vehicle.preferredArea;
                vehicleObj.capacity = vehicle.capacity;
                vehicleObj.capacityUnit = vehicle.capacityUnit;
                vehicleObj.photoUrl = vehicle.photoUrl;
                vehicleObj.vehicleBookUrl = vehicle.vehicleBookUrl;

                const ownerIdx = response.findIndex((owner: any) => owner.id === vehicle.owner.id);
                if (ownerIdx == -1) {
                    const owner: any = {};
                    owner.id = vehicle.owner.id;
                    owner.firstName = vehicle.owner.firstName;
                    owner.lastName = vehicle.owner.lastName;
                    owner.email = vehicle.owner.email;
                    owner.mobNumber = vehicle.owner.mobNumber;
                    owner.vehicles = [vehicleObj];
                    response.push(owner)
                } else {
                    response[ownerIdx].vehicles.push(vehicleObj);
                }
            }

            return res.status(HttpStatus.ACCEPTED).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Accept vehicle temp creation
    @Post('acceptVehicle/:id')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Accepted the vehicle" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiParam({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested vehicle"
    })
    @ApiOperation({ summary: "accept vehicle temporarily creation by id" })
    async acceptVehicle(@Param("id") id: string, @Res() res: Response) {
        try {
            const vehicle = await this.adminService.acceptVehicle(id);

            const html: HTML = new HTML(vehicle.owner.firstName, vehicle.owner.lastName);
            const message: string = html.acceptVehicle(vehicle.regNo);
            await this.commonService.sendNotifications(vehicle.owner.email, `Vehicle No: ${vehicle.regNo} Accepted and Registered Successfully.`, message);

            return res.status(HttpStatus.ACCEPTED).json("Accepted the vehicle");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Reject vehicle temp creation
    @Delete('rejectVehicle/:id')
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Rejected the vehicle" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiParam({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested vehicle"
    })
    @ApiOperation({ summary: "reject vehicle temporarily creation by id" })
    async rejectVehicle(@Param("id") id: string, @Res() res: Response) {
        try {
            const vehicle = await this.adminService.rejectVehicle(id);

            const html: HTML = new HTML(vehicle.owner.firstName, vehicle.owner.lastName);
            const message: string = html.rejectVehicle(vehicle.regNo);
            await this.commonService.sendNotifications(vehicle.owner.email, `Vehicle No: ${vehicle.regNo} Rejected and Registeration Failed.`, message);

            return res.status(HttpStatus.ACCEPTED).json("Rejected the vehicle");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Change password
    @UseGuards(AuthGuard)
    @Put('password/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'admin Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Password changed successfully" })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "change admin password" })
    async changeDriverPassword(@Body() passwordReq: ChangePasswordReq, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.adminService.changePassword(id, passwordReq);
            if (resp) {
                return res.status(HttpStatus.OK).json("Password changed successfully");
            }
            return res.status(HttpStatus.NOT_ACCEPTABLE).json("Old password mismatched");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get upcoming bookings
    @UseGuards(AuthGuard)
    @Get('bookings')
    @ApiResponse({ status: HttpStatus.OK, description: "Booking list", type: [Booking] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the bookings" })
    async getUpcomingBookings(@Res() res: Response) {
        try {
            const resp = await this.adminService.getBookings();
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all the bookings count
    @UseGuards(AuthGuard)
    @Get('bookingsCount')
    @ApiResponse({ status: HttpStatus.OK, description: "Booking count", type: BookingCountRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the bookings count" })
    async getBookingsCount(@Res() res: Response) {
        try {
            const resp = await this.bookingService.getBookingsCount();
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get service charges amount
    @UseGuards(AuthGuard)
    @Get('serviceCharges')
    @ApiResponse({ status: HttpStatus.OK, description: "Service charges list and total" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the servcice charges" })
    async getServiceCharges(@Res() res: Response) {
        try {
            const resp = await this.bookingService.getServiceCharges()
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get rewards expences
    @UseGuards(AuthGuard)
    @Get('rewards')
    @ApiResponse({ status: HttpStatus.OK, description: "Rewards list and total" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the given rewards" })
    async getRewards(@Res() res: Response) {
        try {
            const resp = await this.bookingService.getRewards();
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all feedbacks
    @UseGuards(AuthGuard)
    @Get('feedbacks')
    @ApiResponse({ status: HttpStatus.OK, description: "Feedback list", type: [FeedbackRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "all the feedbacks" })
    async getFeedbacks(@Res() res: Response) {
        try {
            const feedbackList: FeedbackRes[] = [];
            const resp = await this.adminService.getFeedbacks();
            if (resp.length !== 0) {
                for (const f of resp) {
                    const obj: FeedbackRes = new FeedbackRes();
                    obj.id = f.id;
                    obj.customerName = f.customer.firstName + ' ' + f.customer.lastName;
                    obj.feedback = f.feedback;
                    obj.isApproved = f.isApproved;
                    feedbackList.push(obj);
                }
            }
            return res.status(HttpStatus.OK).json(feedbackList);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Approve feedback
    @UseGuards(AuthGuard)
    @Put('approveFeedback/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'feedback id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Feedback id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "approve feedback" })
    async approveFeedback(@Param('id') feedbackId: string, @Res() res: Response) {
        try {
            const resp = await this.adminService.approveFeedback(feedbackId);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Delete feedback
    @UseGuards(AuthGuard)
    @Delete('deleteFeedback/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'feedback id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Feedback id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "delete feedback" })
    async deleteFeedback(@Param('id') feedbackId: string, @Res() res: Response) {
        try {
            const resp = await this.adminService.deleteFeedback(feedbackId);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all owners
    @UseGuards(AuthGuard)
    @Get('owners')
    @ApiResponse({ status: HttpStatus.OK, description: "Available owners list", type: [OwnersRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the owners" })
    async getOwners(@Res() res: Response) {
        try {
            const resp = await this.adminService.getOwners();
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get drivers by the owner
    @UseGuards(AuthGuard)
    @Get('drivers/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Available drivers list", type: [DriversRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the drivers by the owner" })
    async getDrivers(@Param('id') ownerId: string, @Res() res: Response) {
        try {
            const resp = await this.adminService.getDrivers(ownerId);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get customers
    @UseGuards(AuthGuard)
    @Get('customers')
    @ApiResponse({ status: HttpStatus.OK, description: "Available customers list", type: [CustomersRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the available customers" })
    async getCustomers(@Res() res: Response) {
        try {
            const resp = await this.adminService.getCustomers();
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
}