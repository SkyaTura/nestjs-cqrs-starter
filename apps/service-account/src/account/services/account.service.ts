import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from '../inputs/create-account.input';
import { Account } from '../models/account.model';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  create(input: CreateAccountInput) {
    const account = this.accountRepository.create(input);
    return this.accountRepository.save(account);
  }

  findByUserId(userId: string) {
    return this.accountRepository.find({ where: { userId } });
  }
}
