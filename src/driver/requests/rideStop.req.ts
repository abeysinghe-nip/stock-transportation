import { ApiOperation, ApiProperty } from "@nestjs/swagger";

export class RideStopReq {
    @ApiProperty()
    bookingId: string;

    @ApiProperty({enum: ["original", "shared"]})
    bookingType: string;

    @ApiProperty({enum: ["pickup", "destination"]})
    rideType: string;
}