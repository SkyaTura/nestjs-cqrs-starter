import { IEvent } from '@nestjs/cqrs';
import { IUser } from '../interfaces/user.interface';

export class UserActivatedEvent implements IEvent {
  constructor(public readonly user: IUser) {}
}
