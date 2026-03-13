import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { IFriendsRepository } from './interfaces/friends-repository.interface';

describe('FriendsService', () => {
  let service: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: IFriendsRepository,
          useValue: {
            checkFriendshipExists: jest.fn(),
            findPendingRequest: jest.fn(),
            createRequest: jest.fn(),
            deleteRequest: jest.fn(),
            addFriendship: jest.fn(),
            getPendingRequests: jest.fn(),
            getFriendsList: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
