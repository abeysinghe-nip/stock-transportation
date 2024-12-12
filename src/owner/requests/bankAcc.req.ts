import { ApiProperty } from "@nestjs/swagger";

export class BankAccReq {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    bank: string;

    @ApiProperty()
    branch: string;

    @ApiProperty()
    account: string;
}