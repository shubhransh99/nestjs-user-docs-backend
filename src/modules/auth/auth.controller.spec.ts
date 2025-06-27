import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call validateUser and return token', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'pass123',
    };
    const tokenResponse = { access_token: 'mock-token' };

    mockAuthService.validateUser.mockResolvedValue(tokenResponse);

    const result = await controller.login(dto);
    expect(result).toEqual(tokenResponse);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
  });
});
