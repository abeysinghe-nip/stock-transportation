import { ApiProperty } from "@nestjs/swagger";

export class CusSharedBookingRes {
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
    loadingCapacitiy: number;

    @ApiProperty({ enum: ["original", "shared"] })
    type: string;
}