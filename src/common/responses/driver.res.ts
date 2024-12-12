import { ApiProperty } from "@nestjs/swagger";

export class DriverRes {
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

    @ApiProperty()
    heavyVehicle: boolean;
}