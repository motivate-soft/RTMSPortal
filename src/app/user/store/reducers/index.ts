import { ActionReducerMap } from '@ngrx/store';
import { UserState } from '../states/user-state';
import { InjectionToken } from '@angular/core';
import { UserModel } from '../../../shared/models/user.model';
import { createSetValueReducer } from '../../../store/services/createSetValueReducer';
import { LOGGED_IN_USER, MARKETING_URL, USER_SETTINGS } from '../../store/actions';
import { UserSetting } from '../../../shared/models/user-setting';

export const stateKey = 'user';

export const reducers: ActionReducerMap<UserState> = {
  loggedInUser: createSetValueReducer<UserModel>(null, LOGGED_IN_USER),
  marketingUrl: createSetValueReducer<string>(null, MARKETING_URL),
  settings: createSetValueReducer<UserSetting[]>([], USER_SETTINGS),
};

export const reducerToken = new InjectionToken<ActionReducerMap<UserState>>('RegisteredReducers');

export const reducerProvider = [
  {
    provide: reducerToken, useValue: reducers
  }
];
