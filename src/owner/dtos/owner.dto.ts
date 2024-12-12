import { ApiProperty } from "@nestjs/swagger";

export class OwnerDto{
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
    password: string;

    @ApiProperty()
    gsCertiUrl: string;
}