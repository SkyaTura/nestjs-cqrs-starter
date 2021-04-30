import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Account } from '../models/account.model';
import { User } from '../models/user.model';
import { AccountService } from '../services/account.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly accountService: AccountService) {}

  @ResolveProperty(() => [Account])
  accounts(@Parent() user: User) {
    return this.accountService.findByUserId(user.id);
  }
}
