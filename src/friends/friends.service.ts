import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IFriendsRepository } from './interfaces/friends-repository.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  formatPaginatedResponse,
  PaginatedResult,
} from '../common/utils/pagination.util';
import {
  IFriendRequest,
  IPendingFriendRequest,
} from './interfaces/friend-request.interface';
import { AcceptRequestResponseDto } from './dto/accept-request-response.dto';
import { IFriendListItem } from './interfaces/friend.interface';
import { DeclineRequestResponseDto } from './dto/decline-request-response.dto';

@Injectable()
export class FriendsService {
  constructor(
    @Inject(IFriendsRepository)
    private readonly friendsRepository: IFriendsRepository,
  ) {}

  async sendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<IFriendRequest> {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send a friend request to yourself');
    }

    const isFriend = await this.friendsRepository.checkFriendshipExists(
      senderId,
      receiverId,
    );
    if (isFriend) {
      throw new BadRequestException('You are already friends');
    }

    const existingRequest = await this.friendsRepository.findPendingRequest(
      senderId,
      receiverId,
    );
    if (existingRequest) {
      throw new BadRequestException(
        'A friend request already exists between these users',
      );
    }

    return await this.friendsRepository.createRequest(senderId, receiverId);
  }

  async getPendingRequests(
    userId: number,
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResult<IPendingFriendRequest>> {
    const { data, count } = await this.friendsRepository.getPendingRequests(
      userId,
      paginationDto.limit || 10,
      paginationDto.offset || 0,
    );
    return formatPaginatedResponse(
      data,
      count,
      paginationDto.limit || 10,
      paginationDto.offset || 0,
    );
  }

  async acceptRequest(
    userId: number,
    senderId: number,
  ): Promise<AcceptRequestResponseDto> {
    const request = await this.friendsRepository.findPendingRequest(
      senderId,
      userId,
    );

    if (!request || request.senderId === userId) {
      throw new NotFoundException('Friend request not found');
    }

    await this.friendsRepository.deleteRequest(request.id);
    await this.friendsRepository.addFriendship(userId, senderId);

    return { message: 'Friend request accepted' };
  }

  async declineRequest(
    userId: number,
    senderId: number,
  ): Promise<DeclineRequestResponseDto> {
    const request = await this.friendsRepository.findPendingRequest(
      senderId,
      userId,
    );

    if (!request || request.receiverId !== userId) {
      throw new NotFoundException('Friend request not found');
    }

    await this.friendsRepository.deleteRequest(request.id);
    return { message: 'Friend request declined' };
  }

  async getFriendsList(
    userId: number,
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResult<IFriendListItem>> {
    const { data, count } = await this.friendsRepository.getFriendsList(
      userId,
      paginationDto.limit || 10,
      paginationDto.offset || 0,
    );
    return formatPaginatedResponse(
      data,
      count,
      paginationDto.limit || 10,
      paginationDto.offset || 0,
    );
  }
}
