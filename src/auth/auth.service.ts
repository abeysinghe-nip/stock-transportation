import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ){}

    async signin(userId: string, userName: string) {
        const payload = { sub: userId, username: userName };
        return {
            access_token: await this.jwtService.signAsync(payload),
            id: userId
        };
    }
}
