import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'rtms-password-change',
  templateUrl: './password-change.component.html'
})
export class PasswordChangeComponent implements OnInit {

  @Input() passwordChangeIsValid: boolean;
  @Input() newPasswordValue: string;
  @Input() newPasswordValueConfirm: string;
  @Input() requireCurrentPassword: boolean;
  @Input() currentPasswordValue: string;
  @Output() changed = new EventEmitter<boolean>();

  password = '';
  passwordConfirmation = '';
  passwordMeetsRules = false;
  hasOneUpperCharacter = false;
  hasOneLowerCharacter = false;
  hasOneNumber = false;
  hasOneSpecialCharacter = false;
  meetsMinimumCharacter = false;
  passwordsMatch = false;
  existCurrentPassword = '';

  passwordLabelText = 'Password';
  confirmPasswordLabelText = 'Password Confirmation';

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.passwordChangeIsValid = false;
    this.requireCurrentPassword = this.requireCurrentPassword ? this.requireCurrentPassword : false;
    if (this.requireCurrentPassword) {
      this.passwordLabelText = 'New Password';
      this.confirmPasswordLabelText = 'New Password Confirmation';
    }
  }

  setCurrentPassword(): void {
    this.currentPasswordValue = this.existCurrentPassword;
  }

  validatePassword(): void {
    this.loginService.validatePassword(this.password).subscribe(response => {
      const data = response;
      this.hasOneUpperCharacter = data.HasOneUpperCharacter;
      this.hasOneLowerCharacter = data.HasOneLowerCharacter;
      this.hasOneNumber = data.HasOneNumber;
      this.hasOneSpecialCharacter = data.HasOneSpecialCharacter;
      this.meetsMinimumCharacter = data.MeetsMiniumCharacter;
      this.validatePasswordConfirmation();
      this.setPasswordChangeIsValid();
      this.newPasswordValue = this.password;
    });
  }

  setPasswordChangeIsValid(): void {
    this.passwordChangeIsValid = this.hasOneUpperCharacter &&
      this.hasOneLowerCharacter &&
      this.hasOneNumber &&
      this.hasOneSpecialCharacter &&
      this.meetsMinimumCharacter &&
      this.passwordsMatch;

    this.changed.emit(this.passwordChangeIsValid);
  }

  validatePasswordConfirmation(): void {
    this.passwordsMatch = (this.password === this.passwordConfirmation)
      && this.meetsMinimumCharacter;
    this.setPasswordChangeIsValid();
  }

  getImageUrl(checkField: boolean): string {
    return '../src/assets/images/' + (checkField && 'green-check.png' || 'red-x.png');
  }

  public clearChangePassword(): void {
    this.password = '';
    this.passwordConfirmation = '';
    this.existCurrentPassword = '';
    this.currentPasswordValue = null;
    this.newPasswordValue = null;
    this.passwordMeetsRules = false;
    this.hasOneUpperCharacter = false;
    this.hasOneLowerCharacter = false;
    this.hasOneNumber = false;
    this.hasOneSpecialCharacter = false;
    this.meetsMinimumCharacter = false;
    this.passwordsMatch = false;
  }

}
