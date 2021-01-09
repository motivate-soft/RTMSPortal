import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { State } from '../states/state';
import { localStorageSync } from 'ngrx-store-localstorage';
import { stateKey as FilterReducerStateKey } from '../filter/store/reducers';
import { stateKey as UserInterfaceReducerStateKey } from '../userInterface/store/reducers';
import { stateKey as DrillDownStateKey } from '../drill-down/store/reducers';

import { logoutMetaReducer } from '../authentication/store/reducers/logout.metaReducer';
import { stateKey as AuthenticationStateKey } from '../authentication/store/reducers';
import { stateKey as DocumentationStateKey } from '../documentation/store/reducers';

export const reducers: ActionReducerMap<State> = {
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: [FilterReducerStateKey, UserInterfaceReducerStateKey,
                                  DrillDownStateKey, AuthenticationStateKey, DocumentationStateKey],
                           rehydrate: true, storage: sessionStorage })(reducer);
}

export function logoutReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return logoutMetaReducer(reducer);
}

const defaultMetaReducers = [logoutReducer, localStorageSyncReducer];

export const metaReducers: MetaReducer<State>[] = [...defaultMetaReducers];
