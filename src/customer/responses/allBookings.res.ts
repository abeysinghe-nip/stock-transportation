import { ApiProperty } from "@nestjs/swagger";
import { OrgBookingRes } from "./booking.res";
import { CusSharedBookingRes } from "./sharedBooking.res";

export class AllBookingsRes {
    @ApiProperty()
    original : OrgBookingRes[];

    @ApiProperty()
    shared: CusSharedBookingRes[];
}