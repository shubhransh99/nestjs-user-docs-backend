import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    mockUserService.findAll.mockResolvedValue(['user1']);
    const result = await controller.findAll();
    expect(result).toEqual(['user1']);
  });

  it('should return a user by ID', async () => {
    mockUserService.findOne.mockResolvedValue({ id: 1 });
    const result = await controller.findOne(1);
    expect(result).toEqual({ id: 1 });
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'John',
      email: 'john@example.com',
      password: '123456',
      role_id: 2,
    };
    mockUserService.create.mockResolvedValue('new-user');
    const result = await controller.create(dto);
    expect(result).toBe('new-user');
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Updated' };
    mockUserService.update.mockResolvedValue('updated-user');
    const result = await controller.update(1, dto);
    expect(result).toBe('updated-user');
  });

  it('should delete a user', async () => {
    mockUserService.remove.mockResolvedValue(undefined);
    const result = await controller.remove(1);
    expect(result).toBeUndefined();
  });
});
