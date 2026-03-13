import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AcceptRequestResponseDto {
  @ApiProperty({
    description: 'success message accept friend request',
    example: 'Friend request accepted',
  })
  @IsString()
  message: string;
}
