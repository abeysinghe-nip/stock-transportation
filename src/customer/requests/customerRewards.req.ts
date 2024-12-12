import { ApiProperty } from "@nestjs/swagger";

export class CustomerRewardsReq{
    @ApiProperty()
    id: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    isClaimed: boolean;

    @ApiProperty()
    percentage: number;
}