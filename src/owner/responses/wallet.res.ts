import { ApiProperty } from "@nestjs/swagger";
import { OwnerTransDto } from "../dtos/transaction.dto";

export class WalletRes {
    @ApiProperty()
    id: string;

    @ApiProperty({ default: 0 })
    earnings: number;

    @ApiProperty({ default: 0 })
    withdrawels: number;

    @ApiProperty({ default: 0 })
    balance: number;

    @ApiProperty({ type: [OwnerTransDto] })
    transactions: OwnerTransDto[];
}