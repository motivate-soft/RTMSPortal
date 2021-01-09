import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService } from '@uirouter/core';
import { LoginService } from '../login/login.service';
import { PasswordChangeComponent } from '../password-change/password-change.component';

@Component({
  selector: 'rtms-password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {

  token: any;
  message: string;
  passwordChangeIsValid = false;
  submitEnabled = false;
  @ViewChild('passwordChangeComponent', {static: false}) passwordChangeComponent: PasswordChangeComponent;

  constructor(private stateService: StateService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.token = this.stateService.params.token;
    this.message = this.stateService.params.message;
    this.loginService.isTokenStillValid(this.stateService.params.token);
  }

  submit(): void {
    this.loginService.resetPWWithToken( this.passwordChangeComponent.newPasswordValue, this.stateService.params.token).subscribe(response => { });
  }

  cancel(): void {
    this.stateService.transitionTo('home.login');
  }

  public passwordValueChanged(passwordChangeIsValid): void {
    this.passwordChangeIsValid = passwordChangeIsValid;
  }

}
