import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthenticationStateService } from '../../../authentication/store/services/authentication-state.service';

const authTokenStorageKey = 'authToken';
const idTokenStorageKey = 'idToken';

@Injectable()
export class TokenService {

  constructor(
    private localStorageService: LocalStorageService,
    private authenticationStateService: AuthenticationStateService

  ) {
  }
any;
  getAsyncToken(): string {
    return this.authenticationStateService.getAsyncToken();
  }

  setToken(token: string) {
    this.authenticationStateService.setAuthToken(token);
  }

  removeToken(): void {
    this.localStorageService.remove(authTokenStorageKey);
  }

  setTokenClaims(tokenClaims: any) {
    this.authenticationStateService.setTokenClaims(tokenClaims);
  }

  getTokenClaims(): any {
    return this.authenticationStateService.getTokenClaims();
  }

  removeTokenClaims(): any {
    this.authenticationStateService.removeTokenClaims();
  }

}
