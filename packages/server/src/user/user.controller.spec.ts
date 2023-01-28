import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserDocument } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const testUser: User & { id: string } = {
    email: 'test@email.com',
    displayName: 'Test User',
    authService: 'google',
    authServiceId: 'authServiceId',
    avatarUrl: '',
    id: 'userId',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn((id: string) => {
              return new Promise((res, rej) => {
                if (id === testUser.id) {
                  res(testUser);
                }
                rej(new NotFoundException());
              });
            }),
            remove: jest.fn((id: string) => {
              return new Promise((res, rej) => {
                if (id === testUser.id) {
                  res(testUser);
                }
                rej(new NotFoundException());
              });
            }),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('me', () => {
    jest.mock('../user/user.decorator.ts', () => {
      return jest.fn(() => testUser);
    });

    it('should return the user', async () => {
      const user = await userController.me(testUser);
      expect(user).toEqual(testUser);
    });
  });

  describe('findOne', () => {
    it('should retrieve an existing user from the service', async () => {
      const findOneFunction = jest.spyOn(userService, 'findOneById');
      await expect(userController.findOne(testUser.id)).resolves.toEqual(
        testUser,
      );
      expect(findOneFunction).toBeCalledWith(testUser.id);
    });
    it('throws a not found exception if the user does not exist', async () => {
      await expect(userController.findOne('badId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing user from the service', async () => {
      const removeFunction = jest.spyOn(userService, 'remove');
      await expect(userController.remove(testUser.id)).resolves.toEqual(
        testUser,
      );
      expect(removeFunction).toBeCalledWith(testUser.id);
    });
    it('throws a not found exception if the user does not exist', async () => {
      await expect(userController.remove('badId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
