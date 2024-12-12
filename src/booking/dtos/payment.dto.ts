import { ApiProperty } from "@nestjs/swagger";

export class PaymentDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    stripeId: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: ["orginal", "shared"] })
    type: string;
}