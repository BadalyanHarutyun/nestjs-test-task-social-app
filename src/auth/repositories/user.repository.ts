import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { PG_CONNECTION } from '../../common/constants/pgconnection.constants';
import { User } from '../entities/user.entity';
import { IRawUser } from '../interfaces/raw-user.interface';

import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    const res = await this.pool.query(query, [email]);
    if (res.rows[0]) {
      const rawData = res.rows[0] as IRawUser;
      const user = new User();
      user.id = rawData.id;
      user.firstName = rawData.first_name;
      user.lastName = rawData.last_name;
      user.email = rawData.email;
      user.dateOfBirth = rawData.date_of_birth;
      user.password = rawData.password;
      return user;
    }
    return null;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1 LIMIT 1';
    const res = await this.pool.query(query, [id]);

    if (res.rows[0]) {
      const rawData = res.rows[0] as IRawUser;
      const user = new User();
      user.id = rawData.id;
      user.firstName = rawData.first_name;
      user.lastName = rawData.last_name;
      user.email = rawData.email;
      user.dateOfBirth = rawData.date_of_birth;
      return user;
    }
    return null;
  }

  async create(
    userData: Omit<User, 'id'> | RegisterAuthDto,
  ): Promise<User | null> {
    const query = `
      INSERT INTO users (first_name, last_name, email, password, date_of_birth) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.dateOfBirth,
    ];

    const res = await this.pool.query(query, values);
    if (res.rows[0]) {
      const rawData = res.rows[0] as IRawUser;
      const user = new User();
      user.id = rawData.id;
      user.firstName = rawData.first_name;
      user.lastName = rawData.last_name;
      user.email = rawData.email;
      user.dateOfBirth = rawData.date_of_birth;
      return user;
    }
    return null;
  }
}
