import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from '../recipe/recipe.service';
import { RecipeDocument } from '../recipe/schemas/recipe.schema';
import { UserDocument } from '../user/schemas/user.schema';
import { VoteException } from './vote.exception';
import { VoteService } from './vote.service';

describe('VoteService', () => {
  let voteService: VoteService;
  let recipeService: RecipeService;

  const mockUser = {
    id: '123',
  } as UserDocument;

  const mockVote = {
    userId: mockUser.id,
    vote: 'like',
  };

  const mockRecipeDocument = {
    votes: [mockVote],
    getUserVote: jest.fn(() => mockVote),
    save: jest.fn(),
  } as unknown as RecipeDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: RecipeService,
          useValue: {
            findOne: jest.fn(() => mockRecipeDocument),
          },
        },
      ],
    }).compile();

    voteService = module.get<VoteService>(VoteService);
    recipeService = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(voteService).toBeDefined();
  });

  describe('getVote', () => {
    it('should return a vote given a recipeId and user', async () => {
      const vote = await voteService.getVote({
        recipeId: 'abc',
        user: mockUser,
      });

      expect(vote).toEqual({
        userId: '123',
        vote: 'like',
      });
    });

    it('should throw an error if the recipe does not exist', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue(null);

      await expect(
        voteService.getVote({ recipeId: 'wrongId', user: mockUser }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return null if the user has not voted', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue({
        votes: [],
        getUserVote: jest.fn(() => null),
      } as unknown as RecipeDocument);

      const vote = await voteService.getVote({
        recipeId: 'abc',
        user: mockUser,
      });

      expect(vote).toBeNull();
    });
  });

  describe('createVote', () => {
    it('should create a vote given a recipeId, user, and vote', async () => {
      const mockRecipe = {
        votes: [],
        getUserVote: jest.fn(() => null),
        save: jest.fn(),
      } as unknown as RecipeDocument;
      jest.spyOn(recipeService, 'findOne').mockResolvedValue(mockRecipe);

      await voteService.createVote({
        recipeId: 'abc',
        user: mockUser,
        vote: 'like',
      });

      expect(mockRecipe.votes).toEqual([
        {
          userId: '123',
          vote: 'like',
        },
      ]);
      expect(mockRecipe.save).toBeCalled();
    });

    it(' should throw an error if the user already voted', async () => {
      await expect(
        voteService.createVote({
          recipeId: 'abc',
          user: mockUser,
          vote: 'like',
        }),
      ).rejects.toThrow(VoteException);
    });

    it('should throw an error if the recipe does not exist', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue(null);

      await expect(
        voteService.createVote({
          recipeId: 'wrongId',
          user: mockUser,
          vote: 'like',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the vote is not valid', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue({
        votes: [],
        getUserVote: jest.fn(() => null),
      } as unknown as RecipeDocument);

      await expect(
        voteService.createVote({
          recipeId: 'abc',
          user: mockUser,
          vote: undefined,
        }),
      ).rejects.toThrow(VoteException);
    });
  });

  describe('updateVote', () => {
    it('should update a vote given a recipeId, user, and vote', async () => {
      await voteService.updateVote({
        recipeId: 'abc',
        user: mockUser,
        vote: 'dislike',
      });

      expect(mockRecipeDocument.votes[0]).toEqual({
        userId: '123',
        vote: 'dislike',
      });
    });

    it('should throw an error if the recipe does not exist', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue(null);

      await expect(
        voteService.updateVote({
          recipeId: 'wrongId',
          user: mockUser,
          vote: 'like',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the vote is not valid', async () => {
      await expect(
        voteService.updateVote({
          recipeId: 'abc',
          user: mockUser,
          vote: 'wrong',
        } as any),
      ).rejects.toThrow(VoteException);
    });

    it('should throw an error if the user has not voted', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue({
        votes: [],
        getUserVote: jest.fn(() => null),
      } as unknown as RecipeDocument);

      await expect(
        voteService.updateVote({
          recipeId: 'abc',
          user: mockUser,
          vote: 'like',
        }),
      ).rejects.toThrow(VoteException);
    });
  });

  describe('deleteVote', () => {
    it('should delete a vote given a recipeId and user', async () => {
      await voteService.deleteVote({
        recipeId: 'abc',
        user: mockUser,
      });

      expect(mockRecipeDocument.votes).toEqual([]);
    });

    it('should throw an error if the recipe does not exist', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue(null);

      await expect(
        voteService.deleteVote({
          recipeId: 'wrongId',
          user: mockUser,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the user has not voted', async () => {
      jest.spyOn(recipeService, 'findOne').mockResolvedValue({
        votes: [],
        getUserVote: jest.fn(() => null),
      } as unknown as RecipeDocument);

      await expect(
        voteService.deleteVote({
          recipeId: 'abc',
          user: mockUser,
        }),
      ).rejects.toThrow(VoteException);
    });
  });
});
