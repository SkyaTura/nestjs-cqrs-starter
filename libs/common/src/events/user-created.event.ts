import { IEvent } from '@nestjs/cqrs';
import { IUser } from '../interfaces/user.interface';

export class UserCreatedEvent implements IEvent {
  constructor(public readonly user: IUser) {}
}
