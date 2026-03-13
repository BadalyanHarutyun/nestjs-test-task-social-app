import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUsersDto } from './dto/search-users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PaginatedUsersListDto } from './dto/paginated-users-list.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@ApiExtraModels(PaginatedUsersListDto, User)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for users' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of matching users.',
    type: PaginatedUsersListDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedException,
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  async searchUsers(
    @Query() searchDto: SearchUsersDto,
  ): Promise<PaginatedUsersListDto> {
    return await this.usersService.searchUsers(searchDto);
  }
}
