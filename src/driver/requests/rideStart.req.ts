import { ApiProperty } from "@nestjs/swagger";

export class RideStartReq {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bookingId: string;

    @ApiProperty({ enum: ["original", "shared"] })
    bookingType: string;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    latitude: number;
}