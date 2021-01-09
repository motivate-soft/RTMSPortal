import { UserModel } from '../../../shared/models/user.model';
import { UserSetting } from '../../../shared/models/user-setting';

export interface UserState {
  loggedInUser: UserModel;
  marketingUrl: string;
  settings: UserSetting[];
}
