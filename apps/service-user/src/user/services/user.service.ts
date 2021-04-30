import { UserStatus } from '@common/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../inputs/create-user.input';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(input: CreateUserInput) {
    const user = this.userRepository.create(input);
    return this.userRepository.save(user);
  }

  async activate(id: string) {
    await this.userRepository.update(id, { status: UserStatus.ACTIVE });
    return this.findOneById(id);
  }

  findOneById(id: string) {
    return this.userRepository.findOneOrFail(id);
  }

  async remove(id: string) {
    const { affected } = await this.userRepository.delete(id);
    return affected === 1;
  }

  find() {
    return this.userRepository.find({ where: { status: UserStatus.ACTIVE } });
  }
}
