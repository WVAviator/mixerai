import { UserDocument } from './../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { JwtPayload } from './strategies/jwt/types';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

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
            findOneByEmail: jest.fn((email: string) => {
              if (email === testUser.email) {
                return {
                  ...testUser,
                  id: 'userId',
                } as UserDocument;
              }
              return null;
            }),
            create: jest.fn((user: User) => {
              return {
                ...user,
                id: 'userId',
              } as UserDocument;
            }),
          },
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signIn', () => {
    const user: User = {
      email: 'test@email.com',
    } as User;

    const jwtPayload: JwtPayload = {
      email: 'test@email.com',
      sub: 'userId',
    };

    it('should return a JWT if the user exists', async () => {
      const { token } = await authService.signIn(user);
      expect(token).toEqual('jwtToken');
      expect(jwtService.sign).toHaveBeenCalledWith(jwtPayload, {
        secret: 'jwtSecret',
      });
    });

    it('should throw a BadRequestException if no user is provided', async () => {
      await expect(() => authService.signIn(undefined)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('registerUser', () => {
    const testUser2: User = {
      email: 'test2@example.com',
      displayName: 'Test User 2',
      authService: 'google',
      authServiceId: 'authServiceId',
      avatarUrl: '',
    };

    it('should register a new user and return a jwt', async () => {
      const jwt = await authService.registerUser(testUser2);
      expect(jwt).toEqual('jwtToken');
      expect(userService.create).toHaveBeenCalledWith(testUser2);
    });

    it("should create a new user if one doesn't exist when signIn is called", async () => {
      const jwtPayload: JwtPayload = {
        email: 'test2@example.com',
        sub: 'userId',
      };

      await authService.signIn(testUser2);
      expect(userService.create).toHaveBeenCalledWith(testUser2);
      expect(jwtService.sign).toHaveBeenCalledWith(jwtPayload, {
        secret: 'jwtSecret',
      });
    });
  });
});
