import { ApiProperty } from "@nestjs/swagger";

export class DriverDto{
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    licenseUrl: string;

    @ApiProperty()
    photoUrl: string;

    @ApiProperty()
    heavyVehicleLic: boolean;

    @ApiProperty()
    policeCertiUrl: string

    @ApiProperty()
    ownerId: string
}