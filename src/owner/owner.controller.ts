import { Body, Controller, Delete, forwardRef, Get, HttpStatus, Inject, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { OwnerDto } from './dtos/owner.dto';
import { HTML } from 'src/templates/html';
import { CommonService } from 'src/common/common.service';
import { DriverDto } from 'src/driver/dtos/driver.dto';
import { DriverService } from 'src/driver/driver.service';
import { VehicleDto } from 'src/vehicle/dtos/vehicle.dto';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { SignInDto } from 'src/common/requests/signIn.dto';
import { SignInResponse } from 'src/common/responses/signin.res';
import { AssignDriverReq } from './requests/assignDriver.req';
import { DriverVehicle } from 'src/driver/entities/driver.vehicle.entity';
import { AssignDriverRes } from './responses/assignDriver.res';
import { Driver } from 'src/driver/entities/driver.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookingService } from 'src/booking/booking.service';
import { CommonRes } from 'src/common/responses/common.res';
import { ChangePasswordReq } from 'src/common/requests/changePassword.req';
import { WalletRes } from './responses/wallet.res';
import { BankAccReq } from './requests/bankAcc.req';
import { WithdrawalReq } from './requests/withdrawal.req';
import { json } from 'stream/consumers';
import { OwnerRewardsReq } from './requests/ownerRewards.req';
import { ProfileRes } from './responses/profile.res';
import { UpdateProfileReq } from 'src/common/requests/updateProfile.req';
import { NotificationRes } from 'src/common/responses/notification.res';

@ApiTags("vehicle owner")
@Controller('owner')
export class OwnerController {
    constructor(
        private readonly ownerService: OwnerService,
        private readonly commonService: CommonService,
        private readonly driverService: DriverService,
        private readonly vehicleService: VehicleService,
        private readonly authService: AuthService,
        private readonly bookingService: BookingService
    ) { }
    //Create vehicle owner
    @Post('tempCreate')
    @ApiBody({ type: OwnerDto })
    @ApiResponse({ status: HttpStatus.OK, description: "Owner succefully created" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "create vehicel owner temporarily" })
    async tempCreate(@Body() ownerDto: OwnerDto, @Res() res: Response) {
        try {
            const owner = await this.ownerService.create(ownerDto);

            //send notification via email
            const html: HTML = new HTML(owner.firstName, owner.lastName);
            const message: string = html.pendingOwner();
            await this.commonService.sendNotifications(owner.email, 'Your Account is Pending Approval', message);

            return res.status(HttpStatus.OK).json("Owner succefully created");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Owner signin
    @Post('signin')
    @ApiResponse({ status: HttpStatus.OK, description: "Signin response", type: SignInResponse })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Owner not found" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "owner signin" })
    async signin(@Body() signinDto: SignInDto, @Res() res: Response) {
        try {
            const owner = await this.ownerService.signin(signinDto.userName);
            if (owner) {
                const isMatched = await this.commonService.passwordDecrypt(owner.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(owner.id, owner.email);
                    return res.status(HttpStatus.OK).json(access_token)
                }
                return res.status(HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(HttpStatus.NOT_FOUND).json("Owner not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Check owner's email availability
    @Get('emailAvailability/:email')
    @ApiParam({
        name: "email",
        required: true,
        type: String,
        description: "owner entered email address"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Email not found" })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Email exist" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "check availability of the owner email" })
    async emailAvailability(@Param("email") email: string, @Res() res: Response) {
        try {
            const resp: boolean = await this.ownerService.emailAvilability(email);
            if (resp) {
                return res.status(HttpStatus.CONFLICT).json("Email exist");
            }
            return res.status(HttpStatus.OK).json("Email not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Create driver
    @UseGuards(AuthGuard)
    @Post('createDriver')
    @ApiBody({ type: DriverDto })
    @ApiResponse({ status: HttpStatus.OK, description: "Driver succefully created" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "create driver temporarily" })
    async createDriver(@Body() driverDto: DriverDto, @Res() res: Response) {
        try {
            const driver = await this.driverService.tempCreate(driverDto);

            //send notification via email
            const html: HTML = new HTML(driver.owner.firstName, driver.owner.lastName);
            const message: string = html.pendingDriver(driver.firstName, driver.lastName);
            await this.commonService.sendNotifications(driver.owner.email, `Driver ${driver.firstName} ${driver.lastName} Registration Submitted for Approval.`, message);

            return res.status(HttpStatus.OK).json("Driver succefully created");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Create vehicle
    @UseGuards(AuthGuard)
    @Post('createVehicle')
    @ApiBody({ type: VehicleDto })
    @ApiResponse({ status: HttpStatus.OK, description: "Vehicle succefully created" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "create vehicle temporarily" })
    async createVehile(@Body() vehicleDto: VehicleDto, @Res() res: Response) {
        try {
            const vehicle = await this.vehicleService.createVehicle(vehicleDto);

            const html: HTML = new HTML(vehicle.owner.firstName, vehicle.owner.lastName);
            const message = html.pendingVehicle(vehicle.regNo);
            await this.commonService.sendNotifications(vehicle.owner.email, `Vehicle No:${vehicle.regNo} Registration Submitted for Approval`, message);

            return res.status(HttpStatus.OK).json("Vehicle succefully created");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Assign driver to vehicle
    @UseGuards(AuthGuard)
    @Post('assignDriver')
    @ApiBody({ type: AssignDriverReq })
    @ApiResponse({ status: HttpStatus.OK, description: "Assigned ID", type: AssignDriverRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "assign driver to the vehicle" })
    async assignDriver(@Body() assignDriver: AssignDriverReq, @Res() res: Response) {
        try {
            const resp: DriverVehicle = await this.ownerService.assignDriver(assignDriver);
            return res.status(HttpStatus.OK).json({ assignId: resp.id });
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all the assigned drivers by owner ID
    @UseGuards(AuthGuard)
    @Get('assignedDrivers/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of assigned drivers" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the assigned drivers by owner ID" })
    async getAssignedDrivers(@Param("id") id: string, @Res() res: Response) {
        try {
            const resp: DriverVehicle[] = await this.ownerService.getAssignedDrivers(id);
            const response = [];
            if (resp.length != 0) {
                for (const r of resp) {
                    const resObj: any = {};
                    resObj.id = r.id;
                    resObj.assignedDate = r.assignedDate;

                    const driver: any = {};
                    driver.id = r.driver.id;
                    driver.firstName = r.driver.firstName;
                    driver.lastName = r.driver.lastName;
                    driver.email = r.driver.email;
                    driver.phoneNumber = r.driver.phoneNumber;
                    driver.address = r.driver.address;
                    driver.photoUrl = r.driver.photoUrl;
                    driver.licenseUrl = r.driver.licenseUrl;
                    resObj.driver = driver;

                    const vehicle: any = {};
                    vehicle.id = r.vehicle.id;
                    vehicle.type = r.vehicle.type;
                    vehicle.regNo = r.vehicle.regNo;
                    vehicle.photoUrl = r.vehicle.photoUrl;
                    vehicle.heavyVehicle = r.vehicle.heavyVehicle;
                    resObj.vehicle = vehicle;

                    response.push(resObj);
                }
            }
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all the unassigned drivers by owner id
    @UseGuards(AuthGuard)
    @Get('unassignedDrivers/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of unassigned drivers" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the unassigned drivers by owner ID" })
    async getUnssignedDrivers(@Param("id") id: string, @Res() res: Response) {
        try {
            const resp: Driver[] = await this.ownerService.getUnassigendDrivers(id);
            const response = [];
            if (resp.length !== 0) {
                for (const driver of resp) {
                    const respObj: any = {};
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
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get all the unassigned vehicles by owner id
    @UseGuards(AuthGuard)
    @Get('unassignedVehi/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of unassigned vehicles" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the unassigned vehicles by owner ID" })
    async getUnssignedVehicles(@Param("id") id: string, @Res() res: Response) {
        try {
            const resp: Vehicle[] = await this.ownerService.getUnassigendVehicles(id);
            const response = [];
            if (resp.length !== 0) {
                for (const vehicle of resp) {
                    const respObj: any = {};
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
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Unassign the driver
    @UseGuards(AuthGuard)
    @Delete('unassignDriver/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "assign Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Driver successfully unassigned" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "unassign driver from the vehicle" })
    async unassignDriver(@Param("id") id: string, @Res() res: Response) {
        try {
            await this.ownerService.unassignDriver(id);
            return res.status(HttpStatus.OK).json("Driver successfully unassigned");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get owner bookings
    @UseGuards(AuthGuard)
    @Get('myBookings/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Get list of owner's bookings" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get owner's bookings" })
    async getMyBookings(@Param('id') id: string, @Res() res: Response) {
        try {
            const bookings = await this.bookingService.getBookingsByOwner(id);
            const response = [];

            if (bookings.length !== 0) {
                for (const b of bookings) {
                    const booking: any = {};
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

                    const customer: any = {};
                    customer.firstName = b.customer.firstName;
                    customer.lastName = b.customer.lastName;
                    customer.mobileNum = b.customer.mobileNum;
                    booking.customer = customer;

                    response.push(booking);
                }
            }
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get vehicles with assigned driver by vehicle id
    @UseGuards(AuthGuard)
    @Get('driverVehicles/:id')
    @ApiResponse({ status: HttpStatus.OK, description: "Vehicle with assigned driver" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "No any assigned drivers and vehicles" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get vehicle with assgined driver" })
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "vehicle Id"
    })
    async getDriverVehicles(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.getDriverVehicles(id);
            const response: any = {};

            if (!resp) return res.status(HttpStatus.NOT_FOUND).json("No any assigned drivers and vehicles");

            const driver: any = {};
            const vehicle: any = {};
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

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get drivers by owner
    @UseGuards(AuthGuard)
    @Get('drivers/:id')
    @ApiResponse({ status: HttpStatus.OK, description: "owner's drivers list" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get drivers by owner" })
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "owner Id"
    })
    async getDrivers(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.getDrivers(id);
            const response = [];
            if (resp.length !== 0) {
                for (const dr of resp) {
                    const driver: any = {};
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
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Disable driver
    @UseGuards(AuthGuard)
    @Put("disableDriver/:id")
    @ApiResponse({ status: HttpStatus.OK, description: "disabled driver id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Driver has assigned vehicle" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "disable driver" })
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "driver id"
    })
    async disableDriver(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.disableDriver(id);
            if (resp.id) return res.status(HttpStatus.OK).json(resp);

            return res.status(HttpStatus.CONFLICT).json("Driver has assigned vehicle")

        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Enable driver
    @UseGuards(AuthGuard)
    @Put("enableDriver/:id")
    @ApiResponse({ status: HttpStatus.OK, description: "enabled driver id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "enable driver" })
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "driver id"
    })
    async enableDriver(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.enableDriver(id);
            return res.status(HttpStatus.OK).json(resp);
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
        description: 'owner Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Password changed successfully" })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "change owner password" })
    async changeDriverPassword(@Body() passwordReq: ChangePasswordReq, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.changePassword(id, passwordReq);
            if (resp) {
                return res.status(HttpStatus.OK).json("Password changed successfully");
            }
            return res.status(HttpStatus.NOT_ACCEPTABLE).json("Old password mismatched");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get owner's wallet data
    @UseGuards(AuthGuard)
    @Get('wallet/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Owner wallet data", type: WalletRes })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Wallet not found" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get owner's wallet and transactions data" })
    async getWalletData(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.getWalletData(id);
            if (resp) {
                return res.status(HttpStatus.OK).json(resp);
            }
            return res.status(HttpStatus.NOT_FOUND).json("Wallet not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Create bank account
    @UseGuards(AuthGuard)
    @Post('bankAccount/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Wallet Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "create owner's bank account" })
    async createBankAccount(@Param('id') id: string, @Body() bankReq: BankAccReq, @Res() res: Response) {
        try {
            const resp = await this.ownerService.createBankAccount(id, bankReq);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Make withdrawal
    @UseGuards(AuthGuard)
    @Post('makeWithdrawal/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'wallet Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Transaction Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "make a withdrawal" })
    async makeWithdrawal(@Param('id') id: string, @Body() withdrawalReq: WithdrawalReq, @Res() res: Response) {
        try {
            const resp = await this.ownerService.makeWithdrawal(id, withdrawalReq);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Check avilability of bank account
    @UseGuards(AuthGuard)
    @Get('bankAccAvailability/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Wallet Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Bank account not found" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "check availability of bank account" })
    async checkBankAcc(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.checkBankAcc(id);
            if (resp) {
                const commonRes: CommonRes = new CommonRes();
                commonRes.id = resp.id;
                return res.status(HttpStatus.OK).json(commonRes);
            }
            return res.status(HttpStatus.ACCEPTED).json("Bank account not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get owners rewards
    @UseGuards(AuthGuard)
    @Get('rewards/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of rewards", type: [OwnerRewardsReq] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "owner's rewards" })
    async getRewards(@Param('id') id: string, @Res() res: Response) {
        try {
            const ownerRewards: OwnerRewardsReq[] = [];
            const resp = await this.ownerService.getRewards(id);
            if (resp.length !== 0) {
                for (const r of resp) {
                    const respObj: OwnerRewardsReq = new OwnerRewardsReq();
                    respObj.id = r.id;
                    respObj.date = r.date;
                    respObj.isClaimed = r.isClaimed;
                    respObj.rewardAmount = r.rewardAmount;
                    ownerRewards.push(respObj);
                }
            }
            return res.status(HttpStatus.OK).json(ownerRewards);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get owner profile
    @UseGuards(AuthGuard)
    @Get('profile/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Profile data", type: ProfileRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get owner's profile" })
    async getProfile(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.getProfile(id);
            const profile: ProfileRes = new ProfileRes();
            profile.firstName = resp.firstName;
            profile.lastName = resp.lastName;
            profile.address = resp.address;
            profile.nic = resp.nic;
            profile.phoneNo = resp.mobNumber;
            profile.email = resp.email;
            profile.profilePic = resp.profilePic;
            return res.status(HttpStatus.OK).json(profile);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Update owner profile
    @UseGuards(AuthGuard)
    @Put('profile/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Profile id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "update owner's profile" })
    async updateProfile(@Body() profileUpdate: UpdateProfileReq, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.ownerService.updateProfile(id, profileUpdate);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get owner's drivers booking count
    @UseGuards(AuthGuard)
    @Get('driverBookings/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of drivers and bookings count", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get drivers and their completed bookings count" })
    async getDriversBookingCount(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.bookingService.getDriversBookingCount(id);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get notifications of the owner
    @UseGuards(AuthGuard)
    @Get('notification/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of notifications", type: [NotificationRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get notifications by owner id" })
    async getNotifications(@Param('id') id: string, @Res() res: Response) {
        try {
            const response: NotificationRes[] = [];
            const resp = await this.ownerService.getNotifications(id);
            if (resp.length !== 0) {
                for (const n of resp) {
                    const notifyObj: NotificationRes = new NotificationRes();
                    notifyObj.id = n.id;
                    notifyObj.timeStamp = n.date;
                    notifyObj.title = n.title;
                    notifyObj.message = n.message;
                    response.push(notifyObj);
                }
            }
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get total rates of the owner
    @UseGuards(AuthGuard)
    @Get('rates/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "owner rates" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get rates by owner id" })
    async getOwnerRates(@Param('id') ownerId: string, @Res() res: Response) {
        try {
            const resp = await this.bookingService.getOwnerRates(ownerId);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
}   