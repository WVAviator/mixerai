import { GoogleStrategy } from './google.strategy';
import { Test } from '@nestjs/testing';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;

  process.env.GOOGLE_CLIENT_ID = 'google-client-id';
  process.env.GOOGLE_CLIENT_SECRET = 'google-client-secret';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GoogleStrategy],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  describe('validate', () => {
    it('should return a user object', async () => {
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      const profile = {
        id: '123',
        displayName: 'John Doe',
        emails: [{ value: 'johndoe@example.com' }],
        photos: [{ value: 'avatar-url' }],
      } as GoogleProfile;

      const done = jest.fn();
      await googleStrategy.validate(accessToken, refreshToken, profile, done);

      expect(done).toHaveBeenCalledWith(null, {
        email: 'johndoe@example.com',
        displayName: 'John Doe',
        avatarUrl: 'avatar-url',
        authService: 'google',
        authServiceId: '123',
      });
    });

    it('should handle users with no photos', async () => {
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      const profile = {
        id: '123',
        displayName: 'John Doe',
        emails: [{ value: 'johndoe@example.com' }],
        photos: [],
      } as GoogleProfile;

      const done = jest.fn();
      await googleStrategy.validate(accessToken, refreshToken, profile, done);

      expect(done).toHaveBeenCalledWith(null, {
        email: 'johndoe@example.com',
        displayName: 'John Doe',
        avatarUrl: '',
        authService: 'google',
        authServiceId: '123',
      });
    });
  });
});
