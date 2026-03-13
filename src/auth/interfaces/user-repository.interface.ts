import { RegisterAuthDto } from '../dto/register-auth.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(userData: Omit<User, 'id'> | RegisterAuthDto): Promise<User | null>;
}

export const IUserRepository = Symbol('IUserRepository');
