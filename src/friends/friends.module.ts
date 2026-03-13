import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendsRepository } from './repositories/friends.repository';
import { IFriendsRepository } from './interfaces/friends-repository.interface';
import { DbModule } from '../db/db.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DbModule],
  controllers: [FriendsController],
  providers: [
    FriendsService,
    {
      provide: IFriendsRepository,
      useClass: FriendsRepository,
    },
  ],
})
export class FriendsModule {}
