import { Test, TestingModule } from '@nestjs/testing';
import { UserDocument } from '../user/schemas/user.schema';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

describe('VoteController', () => {
  let voteController: VoteController;
  let voteService: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [
        {
          provide: VoteService,
          useValue: {
            getVote: jest.fn(),
            createVote: jest.fn(),
            updateVote: jest.fn(),
            deleteVote: jest.fn(),
          },
        },
      ],
    }).compile();

    voteController = module.get<VoteController>(VoteController);
    voteService = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(voteController).toBeDefined();
  });

  describe('getVote', () => {
    it('should return a vote given a recipeId and user', async () => {
      const getVoteFunction = jest
        .spyOn(voteService, 'getVote')
        .mockResolvedValue({} as any);

      await voteController.getVote('abc', {
        id: '123',
      } as UserDocument);

      expect(getVoteFunction).toBeCalledWith({
        recipeId: 'abc',
        user: {
          id: '123',
        },
      });
    });
  });
  describe('createVote', () => {
    it('should create a vote given a recipeId and user', async () => {
      const createVoteFunction = jest
        .spyOn(voteService, 'createVote')
        .mockResolvedValue({} as any);

      await voteController.createVote({ vote: 'like' }, 'abc', {
        id: '123',
      } as UserDocument);

      expect(createVoteFunction).toBeCalledWith({
        recipeId: 'abc',
        vote: 'like',
        user: {
          id: '123',
        },
      });
    });
  });
  describe('updateVote', () => {
    it('should update a vote given a recipeId and user', async () => {
      const updateVoteFunction = jest
        .spyOn(voteService, 'updateVote')
        .mockResolvedValue({} as any);

      await voteController.updateVote({ vote: 'like' }, 'abc', {
        id: '123',
      } as UserDocument);

      expect(updateVoteFunction).toBeCalledWith({
        recipeId: 'abc',
        vote: 'like',
        user: {
          id: '123',
        },
      });
    });
  });
  describe('deleteVote', () => {
    it('should delete a vote given a recipeId and user', async () => {
      const deleteVoteFunction = jest
        .spyOn(voteService, 'deleteVote')
        .mockResolvedValue({} as any);

      await voteController.deleteVote('abc', {
        id: '123',
      } as UserDocument);

      expect(deleteVoteFunction).toBeCalledWith({
        recipeId: 'abc',
        user: {
          id: '123',
        },
      });
    });
  });
});
