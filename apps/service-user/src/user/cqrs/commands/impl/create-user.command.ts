import { ICommand } from '@nestjs/cqrs';
import { CreateUserInput } from '../../../inputs/create-user.input';

export class CreateUserCommand implements ICommand {
  constructor(public readonly input: CreateUserInput) {}
}
