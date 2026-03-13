import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the friend request',
  })
  id: number;

  @ApiProperty({
    example: 123,
    description: 'The ID of the user who sent the request',
  })
  senderId: number;

  @ApiProperty({
    example: 456,
    description: 'The ID of the user who received the request',
  })
  receiverId: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the request was created',
  })
  createdAt: Date;
}
