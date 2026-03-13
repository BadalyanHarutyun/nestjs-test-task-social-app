import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from './interfaces/users-repository.interface';
import { SearchUsersDto } from './dto/search-users.dto';
import {
  formatPaginatedResponse,
  PaginatedResult,
} from '../common/utils/pagination.util';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async searchUsers(searchDto: SearchUsersDto): Promise<PaginatedResult<User>> {
    const { data, count } = await this.usersRepository.searchUsers(searchDto);

    return formatPaginatedResponse(
      data,
      count,
      searchDto.limit || 10,
      searchDto.offset || 0,
    );
  }
}
