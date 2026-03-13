import { ApiProperty } from '@nestjs/swagger';

export class PendingFriendRequestDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the friend request',
  })
  requestId: number;

  @ApiProperty({ example: 123, description: 'The ID of the sender' })
  senderId: number;

  @ApiProperty({ example: 'John', description: 'The first name of the sender' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the sender' })
  lastName: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the request was created',
  })
  createdAt: Date;
}
