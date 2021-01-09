import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticationState } from '../../../authentication/store/states/authentication-state';
import {
  getSingle,
  getStream,
  setValue
} from '../../../store/services/storeServiceHelper';
import {
  SetAuthTokenAction,
  LogoutAction,
  SetTokenClaimsAction
} from '../../../authentication/store/actions';
import {
  getAuthToken,
  getTokenClaims
} from '../../../authentication/store/selectors';

@Injectable()
export class AuthenticationStateService {
  constructor(private store: Store<AuthenticationState>) {}

  public getAuthToken = getSingle(this.store, getAuthToken);
  public getAuthTokenStream = getStream(this.store, getAuthToken);

  public getTokenClaims = getSingle(this.store, getTokenClaims);
  public setAuthToken = (authToken: string) =>
    setValue(this.store, SetAuthTokenAction, authToken)
  public getAsyncToken(): string {
    const token = this.getAuthToken();
    if (token === null) {
      return undefined;
    } else {
      return token;
    }
  }
  public removeAuthToken(): void {
    this.setAuthToken(null);
  }
  public isTokenExpired(): boolean {
    const token = this.getAuthToken();
    return token === null || token == undefined;
  }


  public logout(): void {
      this.store.dispatch(new LogoutAction());
  }

  public setTokenClaims = (tokenClaims: any) =>
  setValue(this.store, SetTokenClaimsAction, tokenClaims)

  public removeTokenClaims(): void {
    this.setTokenClaims(null);
  }

}
