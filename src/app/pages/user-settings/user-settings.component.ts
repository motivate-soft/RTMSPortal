import { Component, OnInit, ViewChild } from '@angular/core';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { RtmsConstantService } from 'src/app/shared/services/rtms-constant.service';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { UserSettingService } from 'src/app/shared/services/portal/userSetting.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login/login.service';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import { OrganizationModel } from 'src/app/shared/models/models-index';

@Component({
  selector: 'rtms-user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {

  @ViewChild('passwordChangeComponent', {static: false}) passwordChangeComponent: PasswordChangeComponent;

  user = this.userStateService.getLoggedInUser();
  passwordChangeIsValid = false;
  newPasswordValue = '';
  currentPasswordValue = '';
  requireCurrentPassword = true;
  userSettingConstants;
  facility: OrganizationModel[];
  selectedFacility: OrganizationModel;

  constructor(private userStateService: UserStateService,
    private rtmsConstantService: RtmsConstantService,
    private listsStateService: ListsStateService,
    private userSettingService: UserSettingService,
    private toastrService: ToastrService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.userSettingConstants = this.rtmsConstantService.settings;
    this.facility = this.listsStateService.getUserFacilities();
    this.selectedFacility = this.getSelectedFacility();
  }

  getSelectedFacility(): OrganizationModel {
    const setting: any = this.userStateService.getSettings()[this.userSettingConstants.DefaultFacility];
    let selFacility = null;

    if (setting.settingObj.SettingValue !== null) {
      this.facility.forEach(fac => {
        if (fac.OrganizationId === parseInt(setting.settingObj.SettingValue)) {
          selFacility = fac;
        }
      });
    }

    return selFacility;
  }

  saveFacility(): void {
    const value = this.selectedFacility == null ? 0 : this.selectedFacility.OrganizationId;
    const setting: any = this.userStateService.getSettings()[this.userSettingConstants.DefaultFacility];
    if (setting.value !== value) {
      setting.value = value;
      setting.settingObj.SettingValue = value.toString();
      this.userSettingService.saveUserSetting(setting.settingObj).subscribe(response => {
        if (response) {
          this.toastrService.success('Changed default facility.');
        } else {
          this.toastrService.error('Unable to change default facility.');
        }
      });
    }
  }

  submit(): void {
    this.currentPasswordValue = this.passwordChangeComponent.currentPasswordValue;
    this.newPasswordValue = this.passwordChangeComponent.newPasswordValue;
    if (this.currentPasswordValue !== '') {
      this.loginService.login(this.user.UserName, this.currentPasswordValue).subscribe(response => {
        if (!response || !response.Item) { return; }

        if (response.authticket != null || response.Item.AccountStatus === 1) {
          this.ResetPassword();
        } else {
          this.toastrService.error('Unable to Reset Password', 'Invalid current password.');
        }
      });
    } else {
      this.toastrService.error('Unable to Reset Password', 'Please specify current password.');
    }
  }

  ResetPassword(): void {
    this.loginService.resetPW(this.newPasswordValue).subscribe(response => {
      this.passwordChangeComponent.clearChangePassword();
    });
  }

  public passwordValueChanged(passwordChangeIsValid): void {
    this.passwordChangeIsValid = passwordChangeIsValid;
  }

  public canHitEnter(passwordChangeIsValid): void {
    if (passwordChangeIsValid) {
      this.submit();
    }
  }

}
