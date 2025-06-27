import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as passwordUtil from 'src/shared/utils/password.util';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };

  const mockRoleModel = {
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: getModelToken(Role), useValue: mockRoleModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users with roles', async () => {
    const users = [{ name: 'Test' }];
    mockUserModel.findAll.mockResolvedValue(users);

    const result = await service.findAll();
    expect(result).toBe(users);
  });

  it('should return a user by ID', async () => {
    const user = { user_id: 1 };
    mockUserModel.findByPk.mockResolvedValue(user);

    const result = await service.findOne(1);
    expect(result).toBe(user);
  });

  it('should throw if user not found', async () => {
    mockUserModel.findByPk.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should create a user with hashed password', async () => {
    const dto = { name: 'John', email: 'john@test.com', password: 'pass', role_id: 1 };
    const hashed = 'hashed123';
    jest.spyOn(passwordUtil, 'hashPassword').mockResolvedValue(hashed);
    mockRoleModel.findByPk.mockResolvedValue({ id: 1 });
    const saveMock = jest.fn().mockResolvedValue('created-user');

    const newUser = {
      save: saveMock,
      name: '',
      email: '',
      password: '',
      role_id: null,
    };
    jest.spyOn(mockUserModel, 'create').mockReturnValue(newUser);

    const result = await service.create(dto);
    expect(result).toBe('created-user');
  });

  it('should throw if role not found during create', async () => {
    mockRoleModel.findByPk.mockResolvedValue(null);
    await expect(
      service.create({ name: 'a', email: 'e', password: 'p', role_id: 99 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update user fields and save', async () => {
    const user = { set: jest.fn(), save: jest.fn().mockResolvedValue('updated') };
    mockUserModel.findByPk.mockResolvedValue(user);
    mockRoleModel.findByPk.mockResolvedValue({ id: 1 });
    jest.spyOn(service, 'findOne').mockResolvedValue(user);

    const result = await service.update(1, { name: 'new', role_id: 1 });
    expect(result).toBe('updated');
  });

  it('should hash password if updating password', async () => {
    const user = { set: jest.fn(), save: jest.fn().mockResolvedValue('updated') };
    mockUserModel.findByPk.mockResolvedValue(user);
    mockRoleModel.findByPk.mockResolvedValue({ id: 1 });
    jest.spyOn(service, 'findOne').mockResolvedValue(user);
    jest.spyOn(passwordUtil, 'hashPassword').mockResolvedValue('hashed');

    const result = await service.update(1, { password: 'newpass' });
    expect(result).toBe('updated');
  });

  it('should delete user', async () => {
    const destroy = jest.fn();
    const user = { destroy };
    jest.spyOn(service, 'findOne').mockResolvedValue(user);

    await service.remove(1);
    expect(destroy).toHaveBeenCalled();
  });
});
