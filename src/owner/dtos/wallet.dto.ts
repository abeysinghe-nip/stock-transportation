import { ApiProperty } from "@nestjs/swagger";

export class WalletDto {
    @ApiProperty({})
    id: string;

    @ApiProperty({default: 0})
    earnings: number;

    @ApiProperty({default: 0})
    withdrawals: number;
}