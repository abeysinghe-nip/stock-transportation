import { ApiProperty } from "@nestjs/swagger";

export class OwnerRes{
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    mobNumber: string;
}