import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordReq {
    @ApiProperty()
    oldPassword: string;

    @ApiProperty()
    newPassword: string;
}