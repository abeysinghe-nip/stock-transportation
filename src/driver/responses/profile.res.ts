import { ApiProperty } from "@nestjs/swagger";

export class ProfileRes {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNo: string;

    @ApiProperty()
    heavyVehicle: boolean;

    @ApiProperty()
    profilePic: string;
}