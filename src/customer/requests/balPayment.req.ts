import { ApiProperty } from "@nestjs/swagger";

export class BalPaymentReq {    
    @ApiProperty({enum: ["original", "shared"]})
    bookingType: string;

    @ApiProperty()
    stripeId?: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    serviceCharge: number;

    @ApiProperty()
    balPayment: number;

    @ApiProperty()
    rewardId?: string;
}