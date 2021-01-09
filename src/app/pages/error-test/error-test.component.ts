import { Component } from '@angular/core';
import { EnvService } from 'src/app/shared/environment/env.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { TokenService } from 'src/app/shared/auth/services/token.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { AuthenticationStateService } from 'src/app/authentication/store/services/authentication-state.service';
import { PrincipalService } from 'src/app/shared/services/portal/principal.service';
import { Idle } from '@ng-idle/core';

@Component({
  selector: 'rtms-error-test',
  templateUrl: './error-test.component.html'
})

export class ErrorTestComponent {

  constructor(
    private _http: HttpClient,
    private http: HttpClient,
    private tokenService: TokenService,
    private userStateService: UserStateService,
    private authenticationStateService: AuthenticationStateService,
    private principalService: PrincipalService,
    private idle: Idle,
    private envService: EnvService
  ) {
  }

  throwError(errorCode: number): Promise<object> {
    return this._http.get(this.envService.api + 'errortest/throw?errorCode=' + errorCode).toPromise();
  }

  throwJavascriptError(): void {
      throw new Error('Test error from javascript');
  }

  public logout(): void {

    this.userStateService.setLoggedInUser(null);

    this.tokenService.removeToken();
    this.tokenService.removeTokenClaims();
    this.principalService.identity(true);
    this.idle.stop();
    this.userStateService.setLoggedInUser(null);
    this.authenticationStateService.logout();
  }
}
