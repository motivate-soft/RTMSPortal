import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { createSetValueReducer } from '../../../store/services/createSetValueReducer';
import { UserInterfaceState } from '../../store/states/userInterface-state';
import {
  SHOW_SIDE_BAR,
  HIDE_SIDE_BAR_MENU,
  SHOW_TOP_BAR,
  IS_SIDE_BAR_EXPANDED,
  VERSION,
  TO_STATE,
  RETURN_TO_STATE,
  TO_STATE_PARAMS,
  RETURN_TO_STATE_PARAMS,
  FROM_STATE,
  SSO_CONNECTION,
  FROM_STATE_PARAMS,
  SHOW_SWITCH_ORG_ICON
} from '../../store/actions';

export const stateKey = 'userInterface';

export const reducers: ActionReducerMap<UserInterfaceState> = {
  showSideBar: createSetValueReducer<boolean>(false, SHOW_SIDE_BAR),
  hideSideBarMenu: createSetValueReducer<boolean>(false, HIDE_SIDE_BAR_MENU),
  showTopBar: createSetValueReducer<boolean>(false, SHOW_TOP_BAR),
  isSideBarExpanded: createSetValueReducer<boolean>(false, IS_SIDE_BAR_EXPANDED),
  version: createSetValueReducer<string>('', VERSION),
  toState: createSetValueReducer<any>(null, TO_STATE),
  returnToState: createSetValueReducer<any>(null, RETURN_TO_STATE),
  toStateParams: createSetValueReducer<any>(null, TO_STATE_PARAMS),
  returnToStateParams: createSetValueReducer<any>(null, RETURN_TO_STATE_PARAMS),
  fromState: createSetValueReducer<any>(null, FROM_STATE),
  ssoConnection: createSetValueReducer<string>('', SSO_CONNECTION),
  fromStateParams: createSetValueReducer<any>({}, FROM_STATE_PARAMS),
  showSwitchOrgIcon: createSetValueReducer<boolean>(false, SHOW_SWITCH_ORG_ICON),
};

export const reducerToken = new InjectionToken<ActionReducerMap<UserInterfaceState>>('RegisteredReducers');

export const reducerProvider = [
  {
    provide: reducerToken, useValue: reducers
  }
];
