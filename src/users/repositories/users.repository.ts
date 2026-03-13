import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../common/constants/pgconnection.constants';
import { SearchUsersDto } from '../dto/search-users.dto';
import { User } from '../../auth/entities/user.entity';
import { IUsersRepository } from '../interfaces/users-repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async searchUsers(
    searchDto: SearchUsersDto,
  ): Promise<{ data: User[]; count: number }> {
    const {
      firstName,
      lastName,
      minAge,
      maxAge,
      limit = 10,
      offset = 0,
    } = searchDto;

    const conditions: string[] = [];
    const values: string[] = [];
    let paramIndex = 1;

    if (firstName) {
      conditions.push(`first_name ILIKE $${paramIndex++}`);
      values.push(`%${firstName}%`);
    }

    if (lastName) {
      conditions.push(`last_name ILIKE $${paramIndex++}`);
      values.push(`%${lastName}%`);
    }

    if (minAge !== undefined) {
      conditions.push(
        `date_of_birth <= CURRENT_DATE - INTERVAL '${minAge} years'`,
      );
    }

    if (maxAge !== undefined) {
      conditions.push(
        `date_of_birth > CURRENT_DATE - INTERVAL '${maxAge + 1} years'`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) FROM users ${whereClause}
    `;

    const dataQuery = `
      SELECT id,
             first_name   AS "firstName",
             last_name    AS "lastName",
             email,
             date_of_birth AS "dateOfBirth",
             created_at   AS "createdAt",
             updated_at   AS "updatedAt"
      FROM users 
      ${whereClause}
      ORDER BY first_name, last_name
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const [countRes, dataRes] = await Promise.all([
      this.pool.query<{ count: string }>(countQuery, values),
      this.pool.query<Partial<User>>(dataQuery, [...values, limit, offset]),
    ]);

    const count = parseInt(countRes.rows[0].count, 10);
    const data: User[] = dataRes.rows as User[];

    return { data, count };
  }
}
