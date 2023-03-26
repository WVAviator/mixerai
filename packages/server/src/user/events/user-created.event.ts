import { UserDocument } from '../schemas/user.schema';

export class UserCreatedEvent {
  public readonly name = 'user.created';
  public readonly timestamp = Date.now();
  public readonly userDocument;

  constructor(userDocument: UserDocument) {
    this.userDocument = userDocument;
  }
}
