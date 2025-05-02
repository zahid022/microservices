import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @Type()
  @IsString()
  @IsEmail()
  @ApiProperty({ default: 'zahid@example.com' })
  email: string;

  @Type()
  @IsString()
  @MinLength(6)
  @ApiProperty({ default: '123456' })
  password: string;
}
