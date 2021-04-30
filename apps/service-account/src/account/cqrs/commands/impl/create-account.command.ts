import { ICommand } from '@nestjs/cqrs';
import { CreateAccountInput } from '../../../inputs/create-account.input';

export class CreateAccountCommand implements ICommand {
  constructor(public readonly input: CreateAccountInput) {}
}
