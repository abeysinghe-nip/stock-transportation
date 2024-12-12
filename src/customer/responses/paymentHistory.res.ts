import { ApiProperty } from "@nestjs/swagger";

export class PaymentHistoryRes {
    @ApiProperty()
    advancePaymentId: string;

    @ApiProperty()
    advancePaymentDate: Date;

    @ApiProperty()
    advancePaymentAmount: number;

    @ApiProperty()
    balPaymentId: string;

    @ApiProperty()
    balPaymentDate: Date;

    @ApiProperty()
    balPaymentAmount: number;

    @ApiProperty()
    total: number;
}