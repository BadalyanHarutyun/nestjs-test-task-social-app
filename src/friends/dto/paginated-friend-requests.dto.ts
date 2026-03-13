import { ApiProperty } from '@nestjs/swagger';
import { PendingFriendRequestDto } from './pending-friend-request.dto';

export class PaginatedFriendRequestsDto {
  @ApiProperty({
    type: [PendingFriendRequestDto],
    description: 'List of pending friend requests',
  })
  data: PendingFriendRequestDto[];

  @ApiProperty({ example: 10, description: 'Total number of pending requests' })
  count: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  perpage: number;

  @ApiProperty({
    example: 10,
    description: 'Offset for the next page or null if last page',
    nullable: true,
  })
  next: number | null;
}
