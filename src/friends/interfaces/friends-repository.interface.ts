import {
  IFriendRequest,
  IPendingFriendRequest,
} from '../interfaces/friend-request.interface';
import { IFriendListItem } from '../interfaces/friend.interface';

export interface IFriendsRepository {
  checkFriendshipExists(userId1: number, userId2: number): Promise<boolean>;
  findPendingRequest(
    senderId: number,
    receiverId: number,
  ): Promise<IFriendRequest | null>;
  createRequest(senderId: number, receiverId: number): Promise<IFriendRequest>;
  deleteRequest(requestId: number): Promise<IFriendRequest | null>;
  addFriendship(userId: number, friendId: number): Promise<void>;
  getPendingRequests(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<{ data: IPendingFriendRequest[]; count: number }>;
  getFriendsList(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<{ data: IFriendListItem[]; count: number }>;
}

export const IFriendsRepository = Symbol('IFriendsRepository');
