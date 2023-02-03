import { Test, TestingModule } from '@nestjs/testing';
import { Response as ExpressResponse, Request } from 'express';
import { User, UserDocument } from '../user/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let googleOAuthGuard: GoogleOAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        GoogleOAuthGuard,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
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
      const mockRequest: Request & { info: any } = {
        info: {
          callbackUrl: '123',
        },
      } as Request & { info: any };

      const redirect = await authController.googleAuthRedirect(mockRequest);
      expect(redirect).toEqual({
        url: '123',
        statusCode: 302,
      });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const mockUserData = {
        email: 'email',
        id: 'id',
        displayName: 'fakeUser',
      } as UserDocument;
      const loginFunction = jest.spyOn(authService, 'login').mockResolvedValue({
        token: 'token',
        userData: mockUserData,
      });
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as ExpressResponse;
      const mockDto = {
        auid: 'auid',
      };

      const result = await authController.login(mockDto, mockResponse);
      expect(loginFunction).toBeCalledWith(mockDto);
      expect(mockResponse.cookie).toBeCalledWith(
        'mixerai_access_token',
        'token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          signed: true,
        }),
      );
      expect(result).toEqual({
        user: mockUserData,
        message: 'Successfully logged in.',
      });
    });
  });
});
