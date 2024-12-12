import { ApiProperty } from "@nestjs/swagger";

export class CustomersRes {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
    
    @ApiProperty()
    email: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    nic: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    mobileNum: string;
    
    @ApiProperty()
    profilePic: string;

    @ApiProperty()
    originalBoookingCount: number;

    @ApiProperty()
    sharedBookingCount: number;

    @ApiProperty()
    totalBookingCount: number;
}