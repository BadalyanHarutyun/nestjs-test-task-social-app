export interface IFriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  createdAt: Date;
}

export interface IPendingFriendRequest {
  requestId: number;
  senderId: number;
  firstName: string;
  lastName: string;
  createdAt: Date;
}
