import { ApiProperty } from "@nestjs/swagger";

export class TempOwnersDto{
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
    email: string

    @ApiProperty()
    mobNumber: string;

    @ApiProperty()
    gsCertiUrl: string;
}