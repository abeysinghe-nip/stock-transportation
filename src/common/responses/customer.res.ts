import { ApiProperty } from "@nestjs/swagger";

export class CustomerRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    mobNumber: string;
}