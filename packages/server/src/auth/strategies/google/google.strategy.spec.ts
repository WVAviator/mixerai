import { GoogleStrategy } from './google.strategy';
import { Test } from '@nestjs/testing';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Request } from 'express';
import { UserService } from '../../../user/user.service';
import { AuthSessionService } from '../../../auth-session/auth-session.service';
import { User, UserDocument } from '../../../user/schemas/user.schema';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;
  let userService: UserService;
  let authSessionService: AuthSessionService;

  process.env.GOOGLE_CLIENT_ID = 'google-client-id';
  process.env.GOOGLE_CLIENT_SECRET = 'google-client-secret';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(
              (user: User) =>
                ({
                  ...user,
                  id: 'userId',
                } as UserDocument),
            ),
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: AuthSessionService,
          useValue: {
            create: jest.fn(),
            updateWithUserId: jest.fn((auid: string, userId: string) => ({
              auid,
              userId,
              callbackUrl: 'callbackUrl',
            })),
          },
        },
      ],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
    userService = module.get<UserService>(UserService);
    authSessionService = module.get<AuthSessionService>(AuthSessionService);
  });

  describe('validate', () => {
    const testUser = {
      id: 'userId',
      email: 'test@example.com',
      displayName: 'John Doe',
      avatarUrl: 'abc.png',
      authService: 'google',
      authServiceId: '123',
    } as UserDocument;

    const testRequest = {
      query: {
        state: 'auid',
      } as unknown,
    } as Request;

    const testProfile = {
      id: '123',
      displayName: 'John Doe',
      emails: [{ value: 'test@example.com' }],
      photos: [{ value: 'abc.png' }],
    } as GoogleProfile;

    it('should return a user object', async () => {
      const findByEmailFunction = jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue(null);
      const createFunction = jest
        .spyOn(userService, 'create')
        .mockResolvedValue(testUser);
      const updateAuthFunction = jest.spyOn(
        authSessionService,
        'updateWithUserId',
      );
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      const done = jest.fn();
      await googleStrategy.validate(
        testRequest,
        accessToken,
        refreshToken,
        testProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(null, testUser, {
        callbackUrl: 'callbackUrl',
      });
      expect(findByEmailFunction).toHaveBeenCalledWith('test@example.com');
      expect(createFunction).toHaveBeenCalledWith({
        email: 'test@example.com',
        displayName: 'John Doe',
        avatarUrl: 'abc.png',
        authService: 'google',
        authServiceId: '123',
      });
      expect(updateAuthFunction).toHaveBeenCalledWith('auid', testUser.id);
    });

    it('should handle users with no photos', async () => {
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      const profile = {
        ...testProfile,
        photos: [],
      } as GoogleProfile;

      const done = jest.fn();
      await googleStrategy.validate(
        testRequest,
        accessToken,
        refreshToken,
        profile,
        done,
      );

      expect(done).toHaveBeenCalledWith(
        null,
        {
          ...testUser,
          avatarUrl: '',
        },
        {
          callbackUrl: 'callbackUrl',
        },
      );
    });
  });
});
