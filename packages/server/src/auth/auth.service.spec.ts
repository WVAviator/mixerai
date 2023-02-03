import { UserDocument } from './../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { JwtPayload } from './strategies/jwt/types';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthSessionService } from '../auth-session/auth-session.service';
import { AuthSessionDocument } from '../auth-session/schemas/auth-session.schema';
import { AuthenticationSessionException } from '../auth-session/auth-session.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let authSessionService: AuthSessionService;

  const testUser: User = {
    email: 'test@email.com',
    displayName: 'Test User',
    authService: 'google',
    authServiceId: 'authServiceId',
    avatarUrl: '',
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'jwtSecret';

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
            findOneById: jest.fn(() => testUser),
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
          },
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    authSessionService = module.get<AuthSessionService>(AuthSessionService);
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
  });
});
