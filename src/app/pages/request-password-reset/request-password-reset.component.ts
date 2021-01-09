import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';
import { StateService } from '@uirouter/core';

@Component({
  selector: 'rtms-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss']
})
export class RequestPasswordResetComponent {

  email = '';
  username = '';
  resetSuccess = false;
  allowRequest = false;
  showUsernameBlock = false;
  errMessage = '';

  constructor(private stateService: StateService,
    private loginService: LoginService) { }

  checkEmail(): void {
    this.allowRequest = this.loginService.isValidateEmail(this.email);
  }

  checkUsername(): void {
    this.allowRequest = this.username ? this.username !== '' : false;
  }

  toggleDiv(): void {
    this.email = '';
    this.username = '';
    this.errMessage = '';
    this.showUsernameBlock = !this.showUsernameBlock;
    this.resetSuccess = false;
    this.allowRequest = false;
    this.errMessage = '';
  }

  sendPwReset(): void {
    this.resetSuccess = false;
    const email = this.email;
    if (this.loginService.isValidateEmail(email)) {
      this.loginService.requestPWReset(email).subscribe(response => {
        this.email = '';
        this.errMessage = response.UIMessage;
        this.resetSuccess = response.UIMessage !== null;
        this.showUsernameBlock = false;
      });
    }
  }

  cancel(): void {
    this.stateService.transitionTo('home.login');
  }

  requestPasswordResetWithoutEmail(): void {
    this.loginService.requestPasswordResetWithoutEmail(this.username).subscribe(response => {
      this.username = '';
      this.errMessage = response.UIMessage;
      this.resetSuccess = response.UIMessage !== null;
      this.showUsernameBlock = true;
    });
  }

}
