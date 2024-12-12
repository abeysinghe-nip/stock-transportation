import { ApiProperty } from "@nestjs/swagger";

export class ChargesRes {
    @ApiProperty()
    vehicleCharge: number;

    @ApiProperty()
    serviceCharge: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    advancePayment: number;
}