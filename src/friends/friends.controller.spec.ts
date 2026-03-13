import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { IFriendsRepository } from './interfaces/friends-repository.interface';

describe('FriendsController', () => {
  let controller: FriendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        {
          provide: FriendsService,
          useValue: {
            sendRequest: jest.fn(),
            getPendingRequests: jest.fn(),
            acceptRequest: jest.fn(),
            declineRequest: jest.fn(),
            getFriendsList: jest.fn(),
          },
        },
        {
          provide: IFriendsRepository,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
