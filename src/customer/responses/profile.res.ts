import { ApiProperty } from "@nestjs/swagger";

export class ProfileRes {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    nic: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNo: string;

    @ApiProperty()
    profilePic: string;
}