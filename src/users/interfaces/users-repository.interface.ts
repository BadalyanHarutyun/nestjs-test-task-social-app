import { User } from '../../auth/entities/user.entity';
import { SearchUsersDto } from '../dto/search-users.dto';

export interface IUsersRepository {
  searchUsers(
    searchDto: SearchUsersDto,
  ): Promise<{ data: User[]; count: number }>;
}

export const IUsersRepository = Symbol('IUsersRepository');
