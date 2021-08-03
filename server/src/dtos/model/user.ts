import User from '@/models/user';

export default class UserDto {
  id: number;

  name: string;

  avatarUri: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.avatarUri = user.avatarUri;
  }
}
