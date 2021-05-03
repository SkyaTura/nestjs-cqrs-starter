import { Model } from 'mongoose';

export class BaseRepository {
  model: Model<any>;

  create(input: any) {
    console.log(input);
  }
}
