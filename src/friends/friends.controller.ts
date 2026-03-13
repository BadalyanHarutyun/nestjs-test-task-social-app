import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { AcceptRequestResponseDto } from './dto/accept-request-response.dto';
import { FriendRequestDto } from './dto/friend-request.dto';
import { PaginatedFriendRequestsDto } from './dto/paginated-friend-requests.dto';
import { PaginatedFriendsListDto } from './dto/paginated-friends-list.dto';
import { DeclineRequestResponseDto } from './dto/decline-request-response.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@ApiTags('friends')
@ApiBearerAuth()
@ApiExtraModels(
  FriendRequestDto,
  PaginatedFriendRequestsDto,
  PaginatedFriendsListDto,
  DeclineRequestResponseDto,
)
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request/:id')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({
    status: 201,
    description: 'Friend request sent',
    type: FriendRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BadRequestException,
    example: {
      statusCode: 400,
      message: 'Cannot send a friend request to yourself',
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedException,
  })
  sendRequest(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) receiverId: number,
  ): Promise<FriendRequestDto> {
    const userId: number = user.id;
    return this.friendsService.sendRequest(userId, receiverId);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get pending friend requests received' })
  getPendingRequests(
    @CurrentUser() user: User,

    @Query() paginationDto: PaginationQueryDto,
  ) {
    const userId: number = user.id;
    return this.friendsService.getPendingRequests(userId, paginationDto);
  }

  @Post('request/:id/accept')
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiResponse({
    status: 200,
    description: 'Friend request accepted',
    type: AcceptRequestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Friend request not found',
    type: NotFoundException,
    example: {
      statusCode: 404,
      message: 'Friend request not found',
      error: 'Not Found',
    },
  })
  async acceptRequest(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) senderId: number,
  ): Promise<AcceptRequestResponseDto> {
    const userId: number = user.id;
    return await this.friendsService.acceptRequest(userId, senderId);
  }

  @Post('request/:id/decline')
  @ApiOperation({ summary: 'Decline a friend request' })
  @ApiResponse({
    status: 200,
    description: 'Friend request declined',
    type: DeclineRequestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Friend request not found',
    type: NotFoundException,
    example: {
      statusCode: 404,
      message: 'Friend request not found',
      error: 'Not Found',
    },
  })
  async declineRequest(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) senderId: number,
  ): Promise<DeclineRequestResponseDto> {
    const userId: number = user.id;
    return await this.friendsService.declineRequest(userId, senderId);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of friends' })
  @ApiResponse({
    status: 200,
    description: 'List of friends',
    type: PaginatedFriendsListDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getFriendsList(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedFriendsListDto> {
    const userId: number = user.id;
    return await this.friendsService.getFriendsList(userId, paginationDto);
  }
}
