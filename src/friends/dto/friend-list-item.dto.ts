import { ApiProperty } from '@nestjs/swagger';

export class FriendListItemDto {
  @ApiProperty({
    example: 456,
    description: 'The unique identifier of the friend',
  })
  id: number;

  @ApiProperty({ example: 'Jane', description: 'First name of the friend' })
  firstName: string;

  @ApiProperty({ example: 'Smith', description: 'Last name of the friend' })
  lastName: string;

  @ApiProperty({
    example: 'jane.smith@example.com',
    description: 'Email of the friend',
  })
  email: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the friendship was established',
  })
  becameFriendsAt: Date;
}
