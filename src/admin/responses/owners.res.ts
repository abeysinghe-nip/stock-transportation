import { ApiProperty } from "@nestjs/swagger";

export class OwnersRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    nic: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    mobNo: string;

    @ApiProperty()
    gsCertiUrl: string;

    @ApiProperty()
    originalBoookingCount: number;

    @ApiProperty()
    sharedBookingCount: number;

    @ApiProperty()
    totalBookingCount: number;
}