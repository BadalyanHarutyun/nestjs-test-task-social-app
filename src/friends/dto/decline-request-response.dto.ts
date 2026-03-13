import { ApiProperty } from '@nestjs/swagger';

export class DeclineRequestResponseDto {
  @ApiProperty({
    example: 'Friend request declined',
    description: 'A message describing the result',
  })
  message: string;
}
