import { ApiProperty } from "@nestjs/swagger";

export class SharedBookingRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bookingDate: Date;

    @ApiProperty()
    loadingTime: number;

    @ApiProperty()
    unloadingTime: number;

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
    vehicleCharge: number;

    @ApiProperty()
    serviceCharge: number;

    @ApiProperty()
    handlingCharge: number;

    @ApiProperty()
    loadingCapacity: number;

    @ApiProperty()
    avgHandlingTime: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    isCancelled: boolean;

    @ApiProperty()
    bookingId: string;
}