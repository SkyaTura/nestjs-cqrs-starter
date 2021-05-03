import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from '../inputs/create-user.input';
import { User, UserDocument } from '../models/user.model';
import { v4 as UUIDv4 } from 'uuid';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(input: CreateUserInput): Promise<User> {
    const user = new User();
    Object.assign(user, input);
    user.id = UUIDv4();
    await this.model.create(user);
    user.createUser();
    return user;
  }

  async update(id: string, input: Partial<User>): Promise<User> {
    const user = new User();
    Object.assign(user, input);
    user.id = id;
    await this.model.findOneAndUpdate({ id }, user);
    return user;
  }

  async findOneById(id: string) {
    return this.model.findOne({ id }).exec();
  }

  async findOneOrFail(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async find(query: { where: Partial<User> }) {
    return this.model.find(query.where).exec();
  }
}
