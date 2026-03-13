import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Register successful',
    example: { message: 'Register successful' },
  })
  @IsString()
  message: string;
}
