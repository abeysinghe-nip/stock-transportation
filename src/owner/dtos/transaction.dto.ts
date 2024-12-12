import { ApiProperty } from "@nestjs/swagger";

export class OwnerTransDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    date: Date;

    @ApiProperty({ default: 0 })
    amount: number;

    @ApiProperty({ enum: ["cash", "oonline"] })
    mode: string;

    @ApiProperty({ enum: ["credit", "debit"] })
    type: string;
}