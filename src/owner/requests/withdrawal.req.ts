import { ApiProperty } from "@nestjs/swagger";

export class WithdrawalReq {
    @ApiProperty()
    amount: number;

    @ApiProperty()
    rewardId?: string;
}