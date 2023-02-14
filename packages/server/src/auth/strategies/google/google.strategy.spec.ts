import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { AuthSessionService } from '../../../auth-session/auth-session.service';
import { UserDocument } from '../../../user/schemas/user.schema';
import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: AuthSessionService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              return {
                GOOGLE_CLIENT_ID: 'google-client-id',
                GOOGLE_CLIENT_SECRET: 'google-client-secret',
              }[key];
            },
          },
        },
      ],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  describe('validate', () => {
    const testUser = {
      email: 'test@example.com',
      displayName: 'John Doe',
      avatarUrl: 'abc.png',
      authService: 'google',
      authServiceId: '123',
    } as UserDocument;

    const testProfile = {
      id: '123',
      displayName: 'John Doe',
      emails: [{ value: 'test@example.com' }],
      photos: [{ value: 'abc.png' }],
    } as GoogleProfile;

    it('should return a user object', async () => {
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      const done = jest.fn();
      await googleStrategy.validate(
        accessToken,
        refreshToken,
        testProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(null, testUser);
    });

    it('should handle users with no photos', async () => {
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      const profile = {
        ...testProfile,
        photos: [],
      } as GoogleProfile;

      const done = jest.fn();
      await googleStrategy.validate(accessToken, refreshToken, profile, done);

      expect(done).toHaveBeenCalledWith(null, {
        ...testUser,
        avatarUrl: '',
      });
    });
  });
});
