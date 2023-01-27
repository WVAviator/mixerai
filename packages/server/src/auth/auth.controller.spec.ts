import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Response as ExpressResponse } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: AuthService;
  let googleOAuthGuard: GoogleOAuthGuard;

  beforeEach(async () => {
    mockAuthService = {
      signIn: jest.fn(() => new Promise((res) => res('token'))),
    } as unknown as AuthService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        GoogleOAuthGuard,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    mockAuthService = module.get<AuthService>(AuthService);
    googleOAuthGuard = module.get<GoogleOAuthGuard>(GoogleOAuthGuard);
  });

  describe('googleAuth', () => {
    it('should redirect to Google for authentication', async () => {
      jest
        .spyOn(googleOAuthGuard, 'canActivate')
        .mockImplementation(() => true);
      const result = await authController.googleAuth();
      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should process Google OAuth callback', async () => {
      process.env.NODE_ENV = 'production';

      const user = { email: 'test@test.com' };

      jest.mock('../user/user.decorator.ts', () => {
        return jest.fn(() => user);
      });

      const res = Object.assign(
        { cookie: jest.fn() },
        jest.requireActual<ExpressResponse>('express'),
      );

      const result = await authController.googleAuthRedirect(user, res);
      expect(result).toEqual(user);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(user);
      expect(res.cookie).toHaveBeenCalledWith(
        'mixerai_access_token',
        'token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          signed: true,
        }),
      );
    });
  });
});
