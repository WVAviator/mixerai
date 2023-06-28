import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { MockModel } from '../utils/testing/mock.model';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockUserModel: Model<UserDocument>;

  const testUser: User = {
    email: 'test@email.com',
    displayName: 'Test User',
    authService: 'google',
    authServiceId: 'authServiceId',
    avatarUrl: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: MockModel,
        },
        UserService,
      ],
    }).compile();

    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user in the database', async () => {
      const createFunction = jest.spyOn(mockUserModel, 'create');

      const user = await userService.create(testUser);
      expect(createFunction).toBeCalledWith(user);
    });

    it('throws an internal server error if the database fails to create', async () => {
      jest.spyOn(mockUserModel, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(userService.create(testUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const findOneFunction = jest.spyOn(mockUserModel, 'findOne');
      const user = await userService.findOneByEmail('test@email.com');
      expect(findOneFunction).toBeCalledWith({ email: 'test@email.com' });
      expect(user).toBeDefined();
    });

    it("should return null when user doesn't exist", async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);
      expect(userService.findOneByEmail('test')).resolves.toBeNull();
    });

    it('should throw an internal server error if the databse fails to connect', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => {
        throw new Error('Database error');
      });
      await expect(userService.findOneByEmail('test')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      const findOneFunction = jest
        .spyOn(mockUserModel, 'findOne')
        .mockResolvedValue(testUser);
      const user = await userService.findOneById('test');
      expect(findOneFunction).toBeCalledWith({ _id: 'test' });
      expect(user).toBeDefined();
    });

    it("should throw a not found exception when user doesn't exist", async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);
      await expect(userService.findOneById('test')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an internal server error if the databse fails to connect', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => {
        throw new Error('Database error');
      });
      await expect(userService.findOneById('test')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const removeFunction = jest.fn();
      const findFunction = jest
        .spyOn(mockUserModel, 'findOne')
        .mockResolvedValue({ remove: removeFunction });
      await userService.remove('test');
      expect(findFunction).toBeCalledWith({ _id: 'test' });
      expect(removeFunction).toBeCalled();
    });

    it('should throw an internal server error if the databse fails to connect', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => {
        throw new Error('Database error');
      });
      await expect(userService.remove('test')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it("should throw a not found exception when user doesn't exist", async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);
      await expect(userService.remove('test')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
