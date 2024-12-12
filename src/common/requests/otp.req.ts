import { ApiProperty } from "@nestjs/swagger";

export class OtpReq {
    @ApiProperty()
    otp: string;
}