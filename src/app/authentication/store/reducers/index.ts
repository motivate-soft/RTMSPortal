import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { AUTHENTICATION_AUTH_TOKEN, AUTHENTICATION_TOKEN_CLAIMS } from '../../../authentication/store/actions';
import { AuthenticationState } from '../../store/states/authentication-state';
import { createSetValueReducer } from '../../../store/services/createSetValueReducer';

export const stateKey = 'authentication';

export const reducers: ActionReducerMap<AuthenticationState> = {
    authToken: createSetValueReducer<string>(null, AUTHENTICATION_AUTH_TOKEN),
    tokenClaims: createSetValueReducer<any>(null, AUTHENTICATION_TOKEN_CLAIMS)
};
export const reducerToken = new InjectionToken<ActionReducerMap<AuthenticationState>>('RegisteredReducers');

 export const reducerProvider = [
    {
        provide: reducerToken, useValue: reducers
    }
];
