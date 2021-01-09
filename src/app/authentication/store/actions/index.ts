import { SetValueAction } from '../../../store/actions/SetValueAction';
import { Action } from '@ngrx/store';

export const ACTION_LOGOUT = 'ACTION_LOGOUT';

export const AUTHENTICATION_AUTH_TOKEN = 'AUTHENTICATION_AUTH_TOKEN';
export const AUTHENTICATION_TOKEN_CLAIMS = 'AUTHENTICATION_TOKEN_CLAIMS';


export const SetAuthTokenAction = (value: string) => new SetValueAction(AUTHENTICATION_AUTH_TOKEN, value);
export const SetTokenClaimsAction = (value: string) => new SetValueAction(AUTHENTICATION_TOKEN_CLAIMS, value);


export class LogoutAction implements Action {
    readonly type = ACTION_LOGOUT;
}
