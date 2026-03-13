import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';

export class PaginatedUsersListDto {
  @ApiProperty({ type: [User], description: 'List of users' })
  data: User[];

  @ApiProperty({ example: 100, description: 'Total number of matching users' })
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
