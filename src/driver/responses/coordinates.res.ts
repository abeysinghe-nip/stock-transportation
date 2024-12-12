import { ApiProperty } from "@nestjs/swagger";

export class CoordinatesRes {
    @ApiProperty({ default: 0.0 })
    firstLong: number;

    @ApiProperty({ default: 0.0 })
    firstLat: number;

    @ApiProperty({ default: 0.0 })
    secondLong: number;

    @ApiProperty({ default: 0.0 })
    secondLat: number;

    @ApiProperty({ default: 0.0 })
    thirdLong: number;

    @ApiProperty({ default: 0.0 })
    thirdLat: number;

    @ApiProperty({ default: 0.0 })
    fourthLong: number;

    @ApiProperty({ default: 0.0 })
    fourthLat: number;
}