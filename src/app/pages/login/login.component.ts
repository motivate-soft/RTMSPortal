import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { StateService } from '@uirouter/core';
import { LoginService } from './login.service';
import { UtilityService } from 'src/app/shared/services/portal/utility.service';
import { NavigationService } from 'src/app/shared/services/portal/navigation.service';
import { ToastrService } from 'ngx-toastr';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { WindowRefService } from 'src/app/shared/services/portal/window.service';
import { DirectUrlStateService } from 'src/app/shared/services/portal/directUrlState.service';
import { trigger, transition, animate, style, state, query } from '@angular/animations';
import { BaseComponent } from '../../shared/components';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { NgForm } from '@angular/forms';
import { ApplicationInsightsService } from 'src/app/shared/services/application-insights.service';
import { EnvService } from 'src/app/shared/environment/env.service';

declare const grecaptcha: any;

@Component({
  selector: 'rtms-login',
  templateUrl: './login.component.html',
  animations: [
    trigger('usernameAnimation', [
      transition(':enter', [
          style({
            opacity: 0.5,
            left: '-100%',
            position: 'absolute'
          }),
          animate('0.5s', style({
            opacity: 1,
            left: 0,
            position: 'absolute'
          }))
      ]),
      transition(':leave', [
          style({
            opacity: 1,
            left: 0,
            position: 'absolute'
          }),
          animate('0.5s', style({
            opacity: 0.5,
            left: '-100%',
            position: 'absolute'
          }))
      ]),
    ]),
    trigger('passwordAnimation', [
      transition(':enter', [
          style({
            opacity: 0.5,
            left: '100%',
            position: 'absolute'
          }),
          animate('0.5s', style({
            opacity: 1,
            left: 0,
            position: 'absolute'
          }))
      ]),
      transition(':leave', [
          style({
            opacity: 1,
            left: 0,
            position: 'absolute'
          }),
          animate('0.5s', style({
            opacity: 0.5,
            left: '100%',
            position: 'absolute'
          }))
      ]),
    ])
  ]

})
export class LoginComponent extends BaseComponent implements OnInit {

  username = '';
  password = '';
  reCaptchaVal = '';
  loginLoading = false;
  nextLoading = false;
  step = 1;
  loginFailMessage = '';
  version: string;
  isOlderBrowser = false;
  showReactivationSupportMessage = false;
  reCaptchaSiteKeyV2: string;
  reCaptchaV3Failed = false;
  mustPassReCaptcha = false;
  loginAttempts = 0;
  @ViewChild('captchaControl', { static: false }) captchaControl;

  constructor(private stateService: StateService,
    private loginService: LoginService,
    private utilityService: UtilityService,
    public directUrlStateService: DirectUrlStateService,
    private navigationService: NavigationService,
    private toastrService: ToastrService,
    private userInterfaceStateService: UserInterfaceStateService,
    private _win: WindowRefService,
    private applicationInsightsService: ApplicationInsightsService,
    private envService: EnvService,
  ) {
      super();
      this.reCaptchaSiteKeyV2 = this.envService.reCaptchaSiteKeyV2;
  }

  ngOnInit() {
    this.userInterfaceStateService.toggleLoginStates(false);

   this.subscriptions.push(this.userInterfaceStateService.getVersionStream().subscribe((currentVersion: string) => {
      if (currentVersion !== '') {
        this.version = currentVersion;
      }
    }));

    if (this.stateService.params.loginFailure) {
      this.loginFailMessage  = 'Unable to Login. An error occurred during authorization.';
    }

    this.checkTokenExpire();

    this.isOlderBrowser = this.utilityService.isOlderIEBrowser();

    this.checkLogOlderBrowser();
    this.setInputFocus();
  }

  public login() {
    this.showReactivationSupportMessage = false;
    const username = this.username.trim();
    if ((username !== undefined && username !== '') && (this.password !== undefined && this.password !== '')) {
      this.loginLoading = true;
      this.loginService.login(username, this.password, this.reCaptchaVal).subscribe((response: any) => {
        if (response === undefined || response.Item === undefined) {
          return;
        }
        if (response.authticket !== null && response.Item.AccountStatus === 1) {
          const directUrl = this.directUrlStateService.url;
          if (directUrl !== undefined && directUrl !== '') {
            this.directUrlStateService.navigate();
          } else {
            this.navigationService.navigateSelectedOrganizationDashboard();
          }
        } else {
          this.mustPassReCaptcha = response.Item.MustPassReCaptcha;
          this.password = '';
          if (this.captchaControl) { this.captchaControl.reset(); }
          this.loginFailMessage = response.Item.AuthLoginMessage;
          if (response.Item.AccountStatus === 9 && response.Item.userId > 0) {
            this.showReactivationSupportMessage = true;
          } else if (response.Item.AccountStatus === 2) {
            this.loginService.expiredPW(response.Item.PassGuid);
          } else if (response.Item.AccountStatus === 10) {
            this.loginService.mustChangePW(response.Item.PassGuid);
          }
        }
      }, () => { }, () => { this.loginLoading = false; });
    }
  }

  public handleReCaptchaResolved(captchaResponse: string) {
    this.reCaptchaVal = captchaResponse;
  }

  public reCaptchaIsVisible() {
    return this.mustPassReCaptcha;
  }

  public reset() {
    this.stateService.transitionTo('home.requestPasswordReset');
  }

  public help() {
    this.stateService.transitionTo('home.help');
  }

  public next() {
    this.nextLoading = true;
    this.loginService.getFederatedConnection(this.username).subscribe((response) => {
      const connectionName = response.Item;
      if (connectionName) {
        this.applicationInsightsService.setUserId(`${this.username} | ${connectionName}`);
        this.loginService.redirectSSO(connectionName);
      } else if (response && response.Message === null) {
        this.loginService.getValForMustPassReCaptcha(this.username)
          .subscribe((res) => {
            this.step = 2;
            this.mustPassReCaptcha = res.Item;
            setTimeout(() => {
              this.setInputFocus();
            }, 600);
          })
      }
    });
    this.nextLoading = false;
  }

  public back() {
    this.step = 1;
    setTimeout(() => {
      this.setInputFocus();
    }, 600);
  }

  public checkLogOlderBrowser() {
    if (this.isOlderBrowser) {
      this._win.nativeWindow.location = 'incompatible.html';
    }
  }

  public setInputFocus() {
    setTimeout(() => {
      if (this.step === 1) {
        $('#username').focus();

      } else {
        $('#password').focus();

      }
    });
  }

  public checkTokenExpire() {
    if (this.loginService.isTokenExpired()) {
      this.loginFailMessage = this.loginService.getTokenExpiredMessage();
    }
  }

}
