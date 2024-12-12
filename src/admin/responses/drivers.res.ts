import { ApiProperty } from "@nestjs/swagger";

export class DriversRes {
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
    policeCertiUrl: string;

    @ApiProperty()
    licenseUrl: string;

    @ApiProperty()
    photoUrl: string;

    @ApiProperty()
    heavyVehicleLic: boolean;

    @ApiProperty()
    enabled: boolean;

    @ApiProperty()
    originalBoookingCount: number;

    @ApiProperty()
    sharedBookingCount: number;

    @ApiProperty()
    totalBookingCount: number;
}