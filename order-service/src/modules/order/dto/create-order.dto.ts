import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @Type()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'test title' })
  title: string;

  @Type()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'test description' })
  description: string;

  @Type()
  @IsNumber()
  @Min(0)
  @ApiProperty({ default: 100 })
  price: number;
}
