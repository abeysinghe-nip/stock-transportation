import { Response } from "express";
import { CommonService } from "./common.service";
import { BookingService } from "src/booking/booking.service";
import { OtpReq } from "./requests/otp.req";
import { Password } from "./requests/password.req";
export declare class CommonController {
    private readonly commonService;
    private readonly bookingService;
    constructor(commonService: CommonService, bookingService: BookingService);
    getPaymentSummery(id: string, bookingType: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getOwnersData(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getUpcomingDriver(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getCompletedDriver(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getCustomer(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getRateReview(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getVehicle(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getCancelledReasin(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getBookingData(bookingId: string, type: string, res: Response): Promise<Response<any, Record<string, any>>>;
    sendEmailOtp(userEmail: string, userType: string, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyOtp(otp: OtpReq, userId: string, userType: string, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(userId: string, userType: string, password: Password, res: Response): Promise<Response<any, Record<string, any>>>;
    getFeedbacks(res: Response): Promise<Response<any, Record<string, any>>>;
}
