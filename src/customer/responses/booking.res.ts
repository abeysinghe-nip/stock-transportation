import { ApiProperty } from "@nestjs/swagger";

export class OrgBookingRes {
    @ApiProperty()
    id: string;

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
    loadingCapacity: number;

    @ApiProperty()
    isReturnTrip: boolean;

    @ApiProperty()
    willingToShare: boolean;

    @ApiProperty({ enum: ["original", "shared"] })
    type: string;
}