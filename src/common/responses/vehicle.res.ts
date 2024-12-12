import { ApiProperty } from "@nestjs/swagger";

export class VehicleRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    regNo: string;

    @ApiProperty()
    preferredArea: string;

    @ApiProperty()
    capacity: number;

    @ApiProperty()
    capacityUnit: string;

    @ApiProperty()
    photoUrl: string;

    @ApiProperty()
    chargePerKm: number;

    @ApiProperty()
    heavyVehicle: boolean;
}