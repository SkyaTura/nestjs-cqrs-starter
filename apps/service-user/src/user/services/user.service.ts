import { UserStatus } from '@common/interfaces';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from '../inputs/create-user.input';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(input: CreateUserInput) {
    return this.userRepository.create(input);
  }

  async activate(id: string) {
    await this.userRepository.update(id, { status: UserStatus.ACTIVE });
    return this.findOneById(id);
  }

  findOneById(id: string) {
    // @ts-ignore
    return this.userRepository.findOneOrFail(id);
  }

  async remove(id: string) {
    // @ts-ignore
    const { affected } = await this.userRepository.delete(id);
    return affected === 1;
  }

  find() {
    return this.userRepository.find({ where: { status: UserStatus.ACTIVE } });
  }
}
