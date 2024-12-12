import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    signin(userId: string, userName: string): Promise<{
        access_token: string;
        id: string;
    }>;
}
