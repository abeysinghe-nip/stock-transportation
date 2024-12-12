import { ApiProperty } from "@nestjs/swagger";

export class BookingRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    bookingDate: Date;

    @ApiProperty()
    pickupTime: string;

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
    isReturnTrip: boolean;

    @ApiProperty()
    willingToShare: boolean;

    @ApiProperty()
    avgHandlingTime: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    isCancelled: boolean;

    @ApiProperty()
    sharedBookingId: string;
}