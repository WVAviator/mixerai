import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { AuthenticationSessionException } from '../auth-session/auth-session.exception';
import { AuthSessionService } from '../auth-session/auth-session.service';
import { AuthSessionDocument } from '../auth-session/schemas/auth-session.schema';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { UserDocument } from './../user/schemas/user.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let authSessionService: AuthSessionService;
  let eventEmitter: EventEmitter2;

  const testUser: User = {
    email: 'test@email.com',
    displayName: 'Test User',
    authService: 'google',
    authServiceId: 'authServiceId',
    avatarUrl: '',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'jwtToken'),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn(() => new Promise((res) => res(testUser))),
            findOneByEmail: jest.fn(() => new Promise((res) => res(testUser))),
            create: jest.fn((user: User) => {
              return {
                ...user,
                id: 'userId',
              } as UserDocument;
            }),
          },
        },
        {
          provide: AuthSessionService,
          useValue: {
            retrieveAndValidate: jest.fn(() => ({
              userId: 'userId',
            })),
            updateWithUserId: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => 'jwtSecret',
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    authSessionService = module.get<AuthSessionService>(AuthSessionService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token and userData', async () => {
      const findByIdFunction = jest
        .spyOn(userService, 'findOneById')
        .mockResolvedValue({ ...testUser, id: 'userId' } as UserDocument);
      const retrieveAndValidateFunction = jest
        .spyOn(authSessionService, 'retrieveAndValidate')
        .mockResolvedValue({
          userId: 'userId',
        } as AuthSessionDocument);

      const { token, userData } = await authService.login({ auid: 'auid' });

      expect(findByIdFunction).toHaveBeenCalledWith('userId');
      expect(retrieveAndValidateFunction).toHaveBeenCalledWith('auid');

      expect(token).toEqual('jwtToken');
      expect(userData).toEqual({
        ...testUser,
        id: 'userId',
      });
    });

    it('should throw an error if the user is not found', async () => {
      jest.spyOn(userService, 'findOneById').mockResolvedValue(null);

      await expect(authService.login({ auid: 'auid' })).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw an error if the auth session is not found', async () => {
      jest
        .spyOn(authSessionService, 'retrieveAndValidate')
        .mockRejectedValue(new AuthenticationSessionException());

      await expect(authService.login({ auid: 'auid' })).rejects.toThrowError(
        AuthenticationSessionException,
      );
    });

    it('should emit a user signed in event', async () => {
      jest
        .spyOn(userService, 'findOneById')
        .mockResolvedValue({ ...testUser, id: 'userId' } as UserDocument);
      jest.spyOn(authSessionService, 'retrieveAndValidate').mockResolvedValue({
        userId: 'userId',
      } as AuthSessionDocument);

      const emitFunction = jest.spyOn(eventEmitter, 'emit');

      const { userData: userDocument } = await authService.login({
        auid: 'auid',
      });

      expect(emitFunction).toHaveBeenCalledWith(
        'user.login',
        expect.objectContaining({ userDocument }),
      );
    });
  });

  describe('processAuthCallback', () => {
    it('should return a callback url given a valid request', async () => {
      const mockRequest = {
        query: {
          state: '123',
        },
        user: {
          email: 'email',
        },
      } as unknown as Request;

      const findUserFunction = jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue({
          id: 'userId',
        } as UserDocument);
      const updateFunction = jest
        .spyOn(authSessionService, 'updateWithUserId')
        .mockResolvedValue({
          callbackUrl: 'callbackUrl',
        } as AuthSessionDocument);

      const result = await authService.processAuthCallback(mockRequest);

      expect(updateFunction).toHaveBeenCalledWith('123', 'userId');
      expect(findUserFunction).toHaveBeenCalledWith('email');
      expect(result).toEqual({
        callbackUrl: 'callbackUrl',
      });
    });
  });
});
