import { ApiProperty } from "@nestjs/swagger";

export class BookingCountRes {
    @ApiProperty()
    originalUpcoming: number;

    @ApiProperty()
    originalCompleted: number;

    @ApiProperty()
    originalCancelled: number;

    @ApiProperty()
    totalOriginal: number;

    @ApiProperty()
    sharedUpcoming: number;

    @ApiProperty()
    sharedCompleted: number;

    @ApiProperty()
    sharedCancelled: number;

    @ApiProperty()
    totalShared: number;

    @ApiProperty()
    total: number;
}