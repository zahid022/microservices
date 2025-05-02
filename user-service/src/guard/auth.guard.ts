import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { UserService } from '../modules/user/user.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private cls: ClsService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    let token = req.headers.authorization;
    token = token?.split(' ')?.[1] || '';
    try {
      const payload: { userId: number } = this.jwt.verify(token);

      if (!payload.userId) throw new UnauthorizedException();

      const user = await this.userService.getUser(payload.userId);
      if (!user) throw new UnauthorizedException();

      this.cls.set('user', user);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
