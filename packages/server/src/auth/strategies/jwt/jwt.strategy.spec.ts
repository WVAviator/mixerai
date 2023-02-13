import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserService } from '../../../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserDocument } from '../../../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: { findOneById: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: () => 'test' },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  describe('validate', () => {
    it('should validate and return user if JWT is valid', async () => {
      const user: Partial<UserDocument> = {
        email: 'test@example.com',
        id: '123',
      };
      jest
        .spyOn(userService, 'findOneById')
        .mockResolvedValue(user as UserDocument);

      const result = await jwtStrategy.validate({
        email: 'test@example.com',
        sub: '123',
      });
      expect(result).toEqual(user);
      expect(userService.findOneById).toHaveBeenCalledWith('123');
    });

    it('should throw UnauthorizedException if user cannot be found', async () => {
      jest.spyOn(userService, 'findOneById').mockResolvedValue(null);

      await expect(
        jwtStrategy.validate({
          email: 'test@example.com',
          sub: '123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
