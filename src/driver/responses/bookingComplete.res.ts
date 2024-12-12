import { ApiProperty } from "@nestjs/swagger";

export class BookingCompleteRes {
    @ApiProperty()
    vehicleCharge: number;

    @ApiProperty()
    serviceCharge: number;

    @ApiProperty()
    handlingCharge: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    sharedDiscount: string;

    @ApiProperty()
    advancePayment: number;

    @ApiProperty()
    balPayment: number;
}