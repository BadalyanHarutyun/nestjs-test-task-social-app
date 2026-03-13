import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../common/constants/pgconnection.constants';
import {
  IFriendRequest,
  IPendingFriendRequest,
} from '../interfaces/friend-request.interface';
import { IFriendListItem } from '../interfaces/friend.interface';

import { IFriendsRepository } from '../interfaces/friends-repository.interface';

@Injectable()
export class FriendsRepository implements IFriendsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async checkFriendshipExists(
    userId1: number,
    userId2: number,
  ): Promise<boolean> {
    const query =
      'SELECT 1 FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)';
    const res = await this.pool.query(query, [userId1, userId2]);
    return res.rows.length > 0;
  }

  async findPendingRequest(
    senderId: number,
    receiverId: number,
  ): Promise<IFriendRequest | null> {
    const query = `
      SELECT id,
             sender_id   AS "senderId",
             receiver_id AS "receiverId",
             created_at  AS "createdAt"
      FROM friend_requests
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
    `;
    const res = await this.pool.query<IFriendRequest>(query, [
      senderId,
      receiverId,
    ]);
    return res.rows[0] || null;
  }

  async createRequest(
    senderId: number,
    receiverId: number,
  ): Promise<IFriendRequest> {
    const query = `
      INSERT INTO friend_requests (sender_id, receiver_id)
      VALUES ($1, $2)
      RETURNING id,
                sender_id   AS "senderId",
                receiver_id AS "receiverId",
                created_at  AS "createdAt"
    `;
    const res = await this.pool.query<IFriendRequest>(query, [
      senderId,
      receiverId,
    ]);
    return res.rows[0];
  }

  async deleteRequest(requestId: number): Promise<IFriendRequest | null> {
    const query = `
      DELETE FROM friend_requests WHERE id = $1
      RETURNING id,
                sender_id   AS "senderId",
                receiver_id AS "receiverId",
                created_at  AS "createdAt"
    `;
    const res = await this.pool.query<IFriendRequest>(query, [requestId]);
    return res.rows[0] || null;
  }

  async addFriendship(userId: number, friendId: number): Promise<void> {
    const query =
      'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1) ON CONFLICT DO NOTHING';
    await this.pool.query(query, [userId, friendId]);
  }

  async getPendingRequests(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<{ data: IPendingFriendRequest[]; count: number }> {
    const countQuery = `
      SELECT COUNT(*)
      FROM friend_requests fr
      WHERE fr.receiver_id = $1
    `;
    const query = `
      SELECT fr.id          AS "requestId",
             fr.created_at  AS "createdAt",
             u.id           AS "senderId",
             u.first_name   AS "firstName",
             u.last_name    AS "lastName"
      FROM friend_requests fr
      JOIN users u ON fr.sender_id = u.id
      WHERE fr.receiver_id = $1
      ORDER BY fr.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const [countRes, res] = await Promise.all([
      this.pool.query<{ count: string }>(countQuery, [userId]),
      this.pool.query<IPendingFriendRequest>(query, [userId, limit, offset]),
    ]);
    return { data: res.rows, count: parseInt(countRes.rows[0].count, 10) };
  }

  async getFriendsList(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<{ data: IFriendListItem[]; count: number }> {
    const countQuery = `
      SELECT COUNT(*)
      FROM friends f
      WHERE f.user_id = $1
    `;
    const query = `
      SELECT u.id,
             u.first_name        AS "firstName",
             u.last_name         AS "lastName",
             u.email,
             f.created_at        AS "becameFriendsAt"
      FROM friends f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = $1
      ORDER BY u.first_name, u.last_name
      LIMIT $2 OFFSET $3
    `;
    const [countRes, res] = await Promise.all([
      this.pool.query<{ count: string }>(countQuery, [userId]),
      this.pool.query<IFriendListItem>(query, [userId, limit, offset]),
    ]);
    return { data: res.rows, count: parseInt(countRes.rows[0].count, 10) };
  }
}
