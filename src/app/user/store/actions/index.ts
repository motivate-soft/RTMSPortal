import { Action } from '@ngrx/store';
import { SetValueAction } from '../../../store/actions/SetValueAction';
import { UserModel } from '../../../shared/models/user.model';
import { UserSetting } from '../../../shared/models/user-setting';

export const LOGGED_IN_USER = 'LOGGED_IN_USER';
export const MARKETING_URL = 'MARKETING_URL';
export const USER_SETTINGS = 'USER_SETTINGS';


export const loggedInUserAction = (value: UserModel) => new SetValueAction(LOGGED_IN_USER, value);
export const marketingUrlAction = (value: string) => new SetValueAction(MARKETING_URL, value);
export const SetUserSettingsAction = (value: UserSetting[]) => new SetValueAction(USER_SETTINGS, value);

