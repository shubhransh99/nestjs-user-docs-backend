import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as passwordUtil from 'src/shared/utils/password.util';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserModel = {
    findOne: jest.fn(),
  };

  const mockRoleModel = {};
  const mockPermissionModel = {};
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: getModelToken(Role), useValue: mockRoleModel },
        { provide: getModelToken(Permission), useValue: mockPermissionModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return JWT if credentials are valid', async () => {
    const mockUser = {
      user_id: 1,
      email: 'test@example.com',
      password: 'hashed',
      role: {
        name: 'admin',
        permissions: [{ name: 'user.create' }, { name: 'user.read' }],
      },
    };

    jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(passwordUtil, 'comparePasswords').mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('mock-token');

    const result = await service.validateUser('test@example.com', 'plaintext');

    expect(result).toEqual({ access_token: 'mock-token' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      user_id: mockUser.user_id,
      email: mockUser.email,
      role: mockUser.role.name,
      permissions: ['user.create', 'user.read'],
    });
  });

  it('should throw if user not found', async () => {
    jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

    await expect(
      service.validateUser('notfound@example.com', 'pass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if password is incorrect', async () => {
    const mockUser = {
      user_id: 1,
      email: 'test@example.com',
      password: 'hashed',
      role: {
        name: 'admin',
        permissions: [],
      },
    };

    jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(passwordUtil, 'comparePasswords').mockResolvedValue(false);

    await expect(
      service.validateUser('test@example.com', 'wrong'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
