import { ApiProperty } from "@nestjs/swagger";

export class OwnerRewardsReq {
    @ApiProperty()
    id: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    isClaimed: boolean;

    @ApiProperty()
    rewardAmount: number;
}