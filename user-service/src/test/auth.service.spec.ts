import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../database/entities/User.entity';
import { AuthService } from '../modules/auth/auth.service';
import { RegisterDto } from '../modules/auth/dto/register.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => 'hashedPassword123'),
  compare: jest.fn(),
}));

describe('AuthService - register', () => {
  let authService: AuthService;
  let userRepo: Repository<UserEntity>;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockDataSource = {
    getRepository: jest.fn().mockReturnValue(mockUserRepo),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepo = mockDataSource.getRepository(UserEntity);

    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123'
    };

    mockUserRepo.findOne.mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue(undefined);
    const userMock = {
      ...registerDto,
      password: 'hashedPassword123',
      save: saveMock,
    };
    mockUserRepo.create.mockReturnValue(userMock);

    const result = await authService.register(registerDto);


    expect(mockUserRepo.findOne).toHaveBeenCalledWith({
      where: { email: registerDto.email },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    expect(mockUserRepo.create).toHaveBeenCalledWith({
      ...registerDto,
      password: 'hashedPassword123',
    });
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual({ message: 'User is created successfully' });
  });

  it('should throw ConflictException if email already exists', async () => {

    const registerDto: RegisterDto = {
      email: 'existing@example.com',
      password: 'password123'
    };

    mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });

    await expect(authService.register(registerDto)).rejects.toThrow(
      new ConflictException('Email is already exists')
    );

    expect(mockUserRepo.findOne).toHaveBeenCalledWith({
      where: { email: registerDto.email },
    });
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUserRepo.create).not.toHaveBeenCalled();
  });


  it('should hash the password before saving', async () => {

    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123'
    };

    mockUserRepo.findOne.mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue(undefined);
    const userMock = {
      ...registerDto,
      password: 'hashedPassword123',
      save: saveMock,
    };
    mockUserRepo.create.mockReturnValue(userMock);

    await authService.register(registerDto);

    expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    expect(mockUserRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'hashedPassword123',
      })
    );
  });

  it('should propagate database errors during user creation', async () => {

    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123'
    };

    mockUserRepo.findOne.mockResolvedValue(null);

    const dbError = new Error('Database error');
    const saveMock = jest.fn().mockRejectedValue(dbError);
    const userMock = {
      ...registerDto,
      password: 'hashedPassword123',
      save: saveMock,
    };
    mockUserRepo.create.mockReturnValue(userMock);

    await expect(authService.register(registerDto)).rejects.toThrow(dbError);

    expect(saveMock).toHaveBeenCalled();
  });
});