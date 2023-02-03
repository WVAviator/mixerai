import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { DatabaseException } from '../exceptions/database.exceptions';
import { MockModel } from '../utils/testing/mock.model';
import { AuthenticationSessionException } from './auth-session.exception';
import { AuthSessionService } from './auth-session.service';
import { AuthSessionDocument } from './schemas/auth-session.schema';

describe('AuthSessionService', () => {
  let authSessionService: AuthSessionService;
  let authSessionModel: Model<AuthSessionDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthSessionService,
        {
          provide: getModelToken('AuthSession'),
          useValue: MockModel,
        },
      ],
    }).compile();

    authSessionService = module.get<AuthSessionService>(AuthSessionService);
    authSessionModel = module.get<Model<AuthSessionDocument>>(
      getModelToken('AuthSession'),
    );
  });

  it('should be defined', () => {
    expect(authSessionService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new auth session', async () => {
      const createFunction = jest.spyOn(authSessionModel, 'create');
      const authSession = await authSessionService.create(
        'abc123',
        'callbackUrl',
      );

      expect(authSession).toBeDefined();
      expect(authSessionModel.create).toHaveBeenCalledWith({
        auid: 'abc123',
        callbackUrl: 'callbackUrl',
      });
    });

    it('should throw an error if the database fails to create', async () => {
      jest.spyOn(authSessionModel, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        authSessionService.create('abc123', 'callbackUrl'),
      ).rejects.toThrow();
    });
  });

  describe('retrieveAndValidate', () => {
    it('should return an auth session if found', async () => {
      const mockAuthSession = {
        auid: 'abc123',
        callbackUrl: 'callbackUrl',
        userId: 'userId',
        void: false,
        save: jest.fn(),
      } as unknown as AuthSessionDocument;

      jest
        .spyOn(authSessionModel, 'findOne')
        .mockResolvedValue(mockAuthSession);

      const authSession = await authSessionService.retrieveAndValidate(
        'abc123',
      );

      expect(authSession.void).toBe(true);

      expect(authSessionModel.findOne).toHaveBeenCalledWith({ auid: 'abc123' });
      expect(authSession.save).toHaveBeenCalled();
    });

    it('should throw an error if the auth session is not found', async () => {
      jest.spyOn(authSessionModel, 'findOne').mockResolvedValue(null);

      await expect(
        authSessionService.retrieveAndValidate('abc123'),
      ).rejects.toThrow(AuthenticationSessionException);
    });

    it('should throw an error if the auth session is void', async () => {
      const mockAuthSession = {
        auid: 'abc123',
        callbackUrl: 'callbackUrl',
        userId: 'userId',
        void: true,
        save: jest.fn(),
      } as unknown as AuthSessionDocument;

      jest
        .spyOn(authSessionModel, 'findOne')
        .mockResolvedValue(mockAuthSession);

      await expect(
        authSessionService.retrieveAndValidate('abc123'),
      ).rejects.toThrow(AuthenticationSessionException);
    });

    it('should throw an error if the userId has not been added yet', async () => {
      const mockAuthSession = {
        auid: 'abc123',
        callbackUrl: 'callbackUrl',
        void: false,
        save: jest.fn(),
      } as unknown as AuthSessionDocument;

      jest
        .spyOn(authSessionModel, 'findOne')
        .mockResolvedValue(mockAuthSession);

      await expect(
        authSessionService.retrieveAndValidate('abc123'),
      ).rejects.toThrow(AuthenticationSessionException);
    });
  });

  describe('updateWithUserId', () => {
    it('should update the auth session with the user id', async () => {
      const mockAuthSession = {
        auid: 'abc123',
        callbackUrl: 'callbackUrl',
        void: false,
        save: jest.fn(),
        userId: undefined,
      } as unknown as AuthSessionDocument;

      jest
        .spyOn(authSessionModel, 'findOne')
        .mockResolvedValue(mockAuthSession);

      await authSessionService.updateWithUserId('abc123', 'userId');

      expect(mockAuthSession.userId).toBe('userId');
      expect(mockAuthSession.save).toHaveBeenCalled();
    });

    it('should throw an error if the auth session is not found', async () => {
      jest.spyOn(authSessionModel, 'findOne').mockResolvedValue(null);

      await expect(
        authSessionService.updateWithUserId('abc123', 'userId'),
      ).rejects.toThrow(AuthenticationSessionException);
    });
  });
});
