import { ApiProperty } from "@nestjs/swagger";

export class BookingDto {
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
    loadingCapacity: number;

    @ApiProperty()
    isReturnTrip: boolean;

    @ApiProperty()
    willingToShare: boolean;

    @ApiProperty()
    avgHandlingTime: number;

    @ApiProperty({enum: ["upcoming", "complete", "cancelled"]})
    status: string;

    @ApiProperty()
    vehicleId: string;

    @ApiProperty()
    customerId: string;
}