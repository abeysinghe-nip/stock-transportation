import { ApiProperty } from "@nestjs/swagger";

export class SharedBookingReq {
    @ApiProperty()
    bookingId: string;

    @ApiProperty()
    startLong: number;

    @ApiProperty()
    startLat: number;

    @ApiProperty()
    destLong: number;

    @ApiProperty()
    destLat: number;

    @ApiProperty()
    travellingTime: number;

    @ApiProperty()
    avgHandlingTime: number;

    @ApiProperty()
    vehicleCharge: number;

    @ApiProperty()
    serviceCharge: number;

    @ApiProperty({ enum: ["upcoming, complete"] })
    status: string;

    @ApiProperty({ default: false })
    isCancelled: boolean;

    @ApiProperty()
    customerId: string;
}