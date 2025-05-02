import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '../shared/user.interface';
import { OrderService } from '../modules/order/order.service';
import { CreateOrderDto } from '../modules/order/dto/create-order.dto';

describe('OrderService - create', () => {
  let orderService: OrderService;
 
  const mockUser: UserType = {
    id: 1,
    email: 'test@example.com',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  const mockCreateOrderDto: CreateOrderDto = {
    title: 'Test Order',
    description: 'This is a test order',
    price: 100
  };

  const mockCreatedOrder = {
    id: 1,
    userId: mockUser.id,
    title: mockCreateOrderDto.title,
    description: mockCreateOrderDto.description,
    price: mockCreateOrderDto.price,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockClsService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order successfully', async () => {
      mockClsService.get.mockReturnValue(mockUser);
      mockPrismaService.order.create.mockResolvedValue(mockCreatedOrder);

      const result = await orderService.create(mockCreateOrderDto);

      expect(mockClsService.get).toHaveBeenCalledWith('user');
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateOrderDto,
          userId: mockUser.id,
        },
      });
      expect(result).toEqual({
        message: 'Order is created successfully',
        order: mockCreatedOrder,
      });
    });

    it('should include user ID from cls context in the created order', async () => {
      mockClsService.get.mockReturnValue(mockUser);
      mockPrismaService.order.create.mockResolvedValue(mockCreatedOrder);

      await orderService.create(mockCreateOrderDto);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockUser.id,
          }),
        }),
      );
    });

    it('should pass all DTO properties to Prisma create method', async () => {
      mockClsService.get.mockReturnValue(mockUser);
      mockPrismaService.order.create.mockResolvedValue(mockCreatedOrder);

      await orderService.create(mockCreateOrderDto);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateOrderDto,
          userId: mockUser.id,
        },
      });
    });

    it('should propagate database errors', async () => {
      const dbError = new Error('Database error');
      mockClsService.get.mockReturnValue(mockUser);
      mockPrismaService.order.create.mockRejectedValue(dbError);

      await expect(orderService.create(mockCreateOrderDto)).rejects.toThrow(dbError);
      expect(mockClsService.get).toHaveBeenCalledWith('user');
      expect(mockPrismaService.order.create).toHaveBeenCalled();
    });

    it('should throw if user context is missing', async () => {
      mockClsService.get.mockReturnValue(null);

      await expect(orderService.create(mockCreateOrderDto)).rejects.toThrow();
      expect(mockClsService.get).toHaveBeenCalledWith('user');
      expect(mockPrismaService.order.create).not.toHaveBeenCalled();
    });
  });
});