import { ApiProperty } from "@nestjs/swagger";

export class RateReviewReq {
    @ApiProperty()
    rate: number;

    @ApiProperty()
    review?: string;

    @ApiProperty()
    driverId: string;

    @ApiProperty({ enum: ["original", "shared"] })
    bookingType: string;

    @ApiProperty()
    bookingId: string;
}