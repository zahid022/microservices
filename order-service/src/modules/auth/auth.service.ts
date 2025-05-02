import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserWithValidType } from 'src/shared/user.interface';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private userServiceClient: ClientProxy) {}

  async validateToken(token: string) {
    try {
      const result: UserWithValidType = await firstValueFrom(
        this.userServiceClient.send({ cmd: 'validate_token' }, token),
      );

      if (!result.valid) {
        throw new UnauthorizedException('Invalid token');
      }

      return result.user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
