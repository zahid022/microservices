import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../database/entities/User.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private userRepo: Repository<UserEntity>;

  constructor(
    @Inject() private dataSource: DataSource,
    private jwt: JwtService,
  ) {
    this.userRepo = this.dataSource.getRepository(UserEntity);
  }

  async register(params: RegisterDto) {
    const checkEmail = await this.userRepo.findOne({
      where: {
        email: params.email,
      },
    });

    if (checkEmail) throw new ConflictException('Email is already exists');

    const hashedPassword = await hash(params.password, 10);

    const user = this.userRepo.create({
      ...params,
      password: hashedPassword,
    });

    await user.save();

    return {
      message: 'User is created successfully',
    };
  }

  async login(params: LoginDto) {
    const user = await this.userRepo.findOne({
      where: {
        email: params.email,
      },
    });

    if (!user) throw new NotFoundException('Email or password is wrong');

    const checkPassword = await compare(params.password, user.password);

    if (!checkPassword)
      throw new NotFoundException('Email or password is wrong');

    const token = this.jwt.sign({ userId: user.id });

    return {
      token,
    };
  }

  async validateToken(token: string) {
    try {
      const payload: { userId: number } = this.jwt.verify(token);
      const user = await this.userRepo.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new NotFoundException('User is not found');
      }

      return {
        ...user,
        password: undefined,
      };
    } catch {
      return false;
    }
  }
}
