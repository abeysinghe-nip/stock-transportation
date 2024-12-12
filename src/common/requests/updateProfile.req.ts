import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileReq {
    @ApiProperty()
    mobileNo: string;

    @ApiProperty()
    profilePic: string;
}