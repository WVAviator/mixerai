import { UserDocument } from '../../user/schemas/user.schema';

export class UserLoginEvent {
  public readonly name = 'user.login';
  public readonly timestamp = Date.now();
  public readonly userDocument;

  constructor(userDocument: UserDocument) {
    this.userDocument = userDocument;
  }
}
