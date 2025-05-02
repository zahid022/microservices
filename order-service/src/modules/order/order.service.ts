import { Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserType } from '../../shared/user.interface';

@Injectable()
export class OrderService {
  constructor(
    private cls: ClsService,
    private prisma: PrismaService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const user: UserType = this.cls.get('user');

    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        userId: user.id,
      },
    });

    return {
      message: 'Order is created successfully',
      order,
    };
  }

  async findAllByUserId() {
    const user: UserType = this.cls.get('user');

    const orders = await this.prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  async findOrder(id: number) {
    const user: UserType = this.cls.get('user');

    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
