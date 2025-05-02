import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() token: string) {
    try {
      const user = await this.authService.validateToken(token);

      return { valid: true, user };
    } catch {
      return { valid: false };
    }
  }
}
