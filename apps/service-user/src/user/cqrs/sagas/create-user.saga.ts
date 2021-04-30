import { AccountCreatedEvent } from '@common/events';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivateUserCommand } from '../commands/impl/activate-user.command';

@Injectable()
export class CreateUserSaga {
  @Saga()
  accountCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AccountCreatedEvent),
      map((event) => new ActivateUserCommand(event.account.userId)),
    );
  };
}
