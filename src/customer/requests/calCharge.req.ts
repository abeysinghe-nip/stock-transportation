import { ApiProperty } from "@nestjs/swagger";

export class CalChargeReq {
    @ApiProperty()
    vehicleId: string;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    retrurnTrip: boolean;
}