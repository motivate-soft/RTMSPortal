import * as auth0 from 'auth0-js';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateService } from '@uirouter/angular';
import { Observable, of, forkJoin } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { Idle } from '@ng-idle/core';
import { UserSettingService } from '../../shared/services/portal/userSetting.service';
import { TokenService } from '../../shared/auth/services/token.service';
import { FilterStateService } from '../../shared/services/filter-state.service';
import { DirectUrlStateService } from '../../shared/services/portal/directUrlState.service';
import { NavigationService } from '../../shared/services/portal/navigation.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { AuthenticationStateService } from 'src/app/authentication/store/services/authentication-state.service';
import { ToastrService } from 'ngx-toastr';
import { PrincipalService } from '../../shared/services/portal/principal.service';
import { RtmsConstantService } from '../../shared/services/rtms-constant.service';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { EnvService } from '../../shared/services/services-index';
import { AppInitializer } from 'src/app/shared/services/app-initalizer.service';
import { ApplicationInsightsService } from 'src/app/shared/services/application-insights.service';
import { ItemResult } from 'src/app/shared/models/item-result';

@Injectable()
export class LoginService {

  tokenExpired = false;
  tokenExpiredMessage = 'Your Real Time session has expired, please login again.';

  constructor(
    private http: HttpClient,
    private stateService: StateService,
    private userSettingService: UserSettingService,
    private tokenService: TokenService,
    private filterStateService: FilterStateService,
    private directUrlStateService: DirectUrlStateService,
    private navigationService: NavigationService,
    private userStateService: UserStateService,
    private filtersService: FiltersService,
    private listsStateService: ListsStateService,
    private authenticationStateService: AuthenticationStateService,
    private toastrService: ToastrService,
    private principalService: PrincipalService,
    private idle: Idle,
    private rtmsConstantService: RtmsConstantService,
    private userInterfaceStateService: UserInterfaceStateService,
    private envService: EnvService,
    private appInitializer: AppInitializer,
    private applicationInsightsService: ApplicationInsightsService,
  ) {

  }

  public setTokenExpired(val: boolean): void {
    if (val) {
      this.authenticationStateService.removeAuthToken();
    }
    this.tokenExpired = val;
  }

  public isTokenExpired(): boolean {
    const isAuthTokenExpired = this.authenticationStateService.isTokenExpired();
    return this.tokenExpired;
  }

  public getTokenExpiredMessage(): string {
    return this.tokenExpiredMessage;
  }

  public redirectSSO(connectionName: any): void {
    this.userInterfaceStateService.setSSOConnection(connectionName);
    this.appInitializer.auth0SettingsAsync
      .then(auth0Settings => {
        auth0Settings.loginWithRedirect({ connection: connectionName } as RedirectLoginOptions);
      });
  }

  redirectToLogin() {
    this.stateService.go('home.login', { 'loginFailure': true, 'slug': null });
    this.applicationInsightsService.clearUserId();
  }

  redirectToLogoutSSO(error?: any) {
    this.stateService.transitionTo('home.logoutSSO', { 'loginFailure': true, '#': this.userInterfaceStateService.getSSOConnection() });
    this.applicationInsightsService.clearUserId();
    console.log(error);
  }

  public handleAuthentication(): void {
    this.appInitializer.auth0Settings.handleRedirectCallback()
      .then(authResult => {
        Promise.all([
          this.appInitializer.auth0Settings.getTokenSilently(),
          this.appInitializer.auth0Settings.getIdTokenClaims({
            audience: this.envService.auth0.audience,
            scope: this.envService.auth0.scope
          } as getIdTokenClaimsOptions)
        ])
          .then(result => {
            this.tokenService.setToken(result[0]);
            this.tokenService.setTokenClaims(result[1]);
            this.getUserInformationAuth0().subscribe((response: any) => {
              if (!response.Success) {
                this.redirectToLogin();
                return;
              }
              this.setUserSession(response).subscribe(() => {
                const directUrl = this.directUrlStateService.url;
                if (directUrl) {
                  this.directUrlStateService.navigate();
                } else {
                  this.navigationService.navigateSelectedOrganizationDashboard();
                }
              },
              (error: any) => {
                this.redirectToLogoutSSO(error);
              });
            },
            (error: any) => {
              this.redirectToLogoutSSO(error);
            });
          })
          .catch(err => {
            this.redirectToLogoutSSO(err);
          });
      })
      .catch(err => {
        this.redirectToLogoutSSO(err);
      });
  }

  private navigateToLogin(error?: any) {
    this.stateService.go('home.login', { 'loginFailure': true });
    console.log(error);
  }
  public getUserInformationAuth0(): Observable<any> {
    const json = this.tokenService.getTokenClaims();
    return this.http.post(this.envService.api + 'Authentication/auth0-user', json);
  }

  public getUserInformation(): Observable<any> {
    return this.http.post(this.envService.api + 'Authentication/auth-user', null);
  }

  public login(un: string, pw: string, reCaptchaToken: string = '') {
    const auth = {
      userName: un,
      pw: pw,
      reCaptchaToken: reCaptchaToken,
    };

    if (auth.userName !== '' && auth.pw !== '') { } { } { } {
      return this.http.post(this.envService.api + 'Authentication/Authenticate', auth)
        .pipe(
          flatMap((response: any) => {
            if (response.Success) {
              if (response.authticket !== null) {
                this.tokenService.setToken(response.authticket);
                return this.setUserSession(response)
                  .pipe(
                    map(() => {
                      return response;
                    })
                  );
              } else {
                return of(response);
              }
            } else {
              return of(response);
            }
          }));
    }
  }

  public refreshForSwitchingOrgs() {
    this.getUserInformation()
    .subscribe(res => {
      this.setUserSession(res)
        .subscribe(resp => {

          window.location.reload();
        });
    });
  }

  public loginUsingToken() {
    return this.getUserInformation().pipe(
      flatMap((data: any) => {
        return this.setUserSession(data);
      }));
  }

  public getFederatedConnection(userName: string): Observable<any> {
    const request = { strRequest: userName };

    const url = 'Authentication/get-federated-connection';

    return this.http.post(this.envService.api + url, request);
  }

  public getValForMustPassReCaptcha(userName: string): Observable<ItemResult<boolean>> {
    const request = { strRequest: userName };
    const url = 'Authentication/get-value-for-must-pass-recaptcha';

    return this.http.post<ItemResult<boolean>>(`${this.envService.api}${url}`, request);
  }

  public validatePassword(pw: string): Observable<any> {
    const request = {
      strRequest: pw
    };

    return this.http.post(this.envService.api + 'Authentication/ValidatePassword', request);
  }

  public setUserSession(response: any): Observable<any> {
    this.setTokenExpired(false);

    const loggedInUser = {
      userId: response.Item.userId,
      FirstName: response.Item.FirstName,
      LastName: response.Item.LastName,
      TimeZoneId: response.Item.TimeZoneId,
      EmailId: response.Item.EmailId,
      DashboardType: response.Item.DashboardType,
      IsCorporateUser: response.Item.IsCorporateUser,
      OrganizationId: response.Item.OrganizationId,
      IsSSO: response.Item.IsSSO,
      UserName: response.Item.UserName,
      ReceptiveIoConfiguration: response.Item.ReceptiveIoConfiguration,
      HasAdditionalOrganizations: response.Item.HasAdditionalOrganizations,
      OrganizationName: response.Item.OrganizationName,
      OrganizationNameAbbrev: response.Item.OrganizationName.length > 25 ?
        response.Item.OrganizationName.substring(0, 25) + '...' : response.Item.OrganizationName
    };

    if (!response.Item.IsSSO) {
      this.userInterfaceStateService.setSSOConnection('');
    }

    this.userStateService.setLoggedInUser(loggedInUser);

    this.listsStateService.setUserFacilities(response.Item.userFacilities);
    this.listsStateService.setUserOrganizations(response.Item.userOrganizations);
    this.listsStateService.setReportEnums(response.Item.ReportEnums);
    this.listsStateService.setUserHSOrganization(response.Item.userHSOrgs);
    this.listsStateService.setReportGroups(response.Item.ReportGroupEnums);
    this.listsStateService.setOrganizationTypes(response.Item.OrganizationTypes);
    this.listsStateService.setDashboards(response.Item.Dashboards);
    this.principalService.authenticate(response.Item);
    this.applicationInsightsService.setUserId(`${loggedInUser.FirstName} ${loggedInUser.LastName} | ${loggedInUser.userId}`);

    return this.userSettingService.getUserSettings()
      .pipe(
        tap((userSettings: any) => {
          this.userStateService.setSettings(userSettings);
          // Set default facility if no facility is selected yet
          this.filtersService.organizations.get();
        })
      );
  }



  public requestPWReset(email: string): Observable<any> {
    const emailAddress = {
      strRequest: email
    };

    return this.http.post(this.envService.api + 'Authentication/RequestPasswordReset', emailAddress);
  }

  public requestPasswordResetWithoutEmail(uname: string): Observable<any> {
    const username = {
      strRequest: uname
    };

    return this.http.post(this.envService.api + 'Authentication/resetpassword-without-email', username);
  }

  public expiredPW(token: any): void {
    this.stateService.transitionTo('home.passwordreset', { 'token': token });
    this.toastrService.warning('Your password has expired.  Please select a new one.', null, { timeOut: 15000 });
  }

  public mustChangePW(token: any): void {
    this.stateService.transitionTo('home.passwordreset', { 'token': token });
    this.toastrService.warning('Your temporary password must be changed. Please choose a new password.', null, { timeOut: 15000 });
  }

  public isTokenStillValid(token: any): any {
    const passwordResetRequest = {
      Token: token
    };
    return this.http.post(this.envService.api + 'Authentication/IsUserTokenValid', passwordResetRequest).subscribe((response: any) => {
      if (response.Success) {
        if (response.UIMessage !== null) {
          this.stateService.transitionTo('home.requestPasswordReset', { 'token': token });
          this.toastrService.warning('Your email reset link has expired. Please enter your email address and have a new one sent.',
            null, { timeOut: 30000 });
        }
      }
    });
  }

  public resetPWWithToken(pw: string, token: any): Observable<any> {
    const passwordResetRequest = {
      Token: token,
      Password: pw
    };
    return this.http.post(this.envService.api + 'Authentication/ResetPasswordWithToken', passwordResetRequest)
      .pipe(
        tap((response: any) => {
          if (response.Success) {
            if (response.UIMessage === null) {
              this.toastrService.success('Password has been successfully reset.');
              this.stateService.go('home.login');
            } else {
              this.toastrService.error(response.UIMessage, 'Unable to Reset Password');
            }
          }
        })
      );
  }

  public resetPW(pw: string): Observable<any> {
    const passwordResetRequest = {
      Password: pw
    };
    return this.http.post(this.envService.api + 'Authentication/ResetPassword', passwordResetRequest)
      .pipe(
        tap((response: any) => {
          if (response.Success) {
            if (response.UIMessage === null) {
              this.toastrService.success('Password has been successfully reset');
            } else {
              this.toastrService.error(response.UIMessage, 'Unable to Reset Password');
            }
          }
        })
      );
  }

  public logout(): void {
    this.http.get(this.envService.api + 'Authentication/logoff').subscribe((response) => {
      this.clearSession(true);
    });
  }

  public logoutAndSwitchOrgs(): void {
    this.getUserInformation()
      .subscribe(res => {
        this.setUserSession(res);
      });
  }

  public reload(): void {
    document.location.href = '/';
  }

  public clearSession(reload: any): void {
    this.tokenService.removeToken();
    this.tokenService.removeTokenClaims();
    this.principalService.identity(true);
    this.idle.stop();
    this.userStateService.setLoggedInUser(null);
    const versionNumber = this.userInterfaceStateService.getVersion();
    const ssoConnection = this.userInterfaceStateService.getSSOConnection();
    this.authenticationStateService.logout();
    this.userInterfaceStateService.setVersion(versionNumber);
    if (this.userStateService.getLoggedInUser() && this.userStateService.getLoggedInUser().IsSSO) {
      this.appInitializer.auth0Settings.logout({ returnTo: location.protocol + '//' + location.host + '/logout-sso#' + ssoConnection } as LogoutOptions);
    } else {
      if (reload) {
        this.stateService.go('home.login');
      }
    }
  }

  public isValidateEmail(mail: string): boolean {
    return (/^\w+([\.-]\w+)*@\w+([\.-]\w+)*(\.\w{2,})+$/.test(mail));
  }

  public checkRecaptcha(token: string): Observable<any> {
    return this.http.post(this.envService.api + 'Authentication/check-recaptcha', { strRequest: token });
  }
}
