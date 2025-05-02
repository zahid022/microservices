import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/database/entities/User.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  private userRepo: Repository<UserEntity>;

  constructor(
    @Inject() private dataSource: DataSource,
    private cls: ClsService,
  ) {
    this.userRepo = this.dataSource.getRepository(UserEntity);
  }

  findUser(id: number) {
    const user = this.cls.get<UserEntity>('user');

    if (user.id !== id) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return {
      ...user,
      password: undefined,
    };
  }

  getUser(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
}
