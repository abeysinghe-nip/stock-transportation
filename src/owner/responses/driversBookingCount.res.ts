import { ApiProperty } from "@nestjs/swagger";

export class DriversBookingCountRes{
    @ApiProperty()
    driverId: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    bookingCount: number;
}