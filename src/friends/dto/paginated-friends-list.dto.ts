import { ApiProperty } from '@nestjs/swagger';
import { FriendListItemDto } from './friend-list-item.dto';

export class PaginatedFriendsListDto {
  @ApiProperty({ type: [FriendListItemDto], description: 'List of friends' })
  data: FriendListItemDto[];

  @ApiProperty({ example: 50, description: 'Total number of friends' })
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
