import { Component, Pipe, ViewChild, TemplateRef } from '@angular/core';
import { UserModel, User } from 'src/app/shared/models/models-index';
import { UserAdminService } from 'src/app/shared/services/portal/userAdmin.service';
import { GridColumn } from 'src/app/shared/components/rtms-grid-v2/grid-column';
import { TemplateColumn } from 'src/app/shared/components/rtms-grid-v2/template-column';
import { StateService } from '@uirouter/core';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard } from 'src/app/shared/models/dashboard';
import { FormsModule } from '@angular/forms';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { Observable } from 'rxjs';
import { ValidationError } from 'src/app/shared/models/validation-error.model';
import { ErrorSeverity } from 'src/app/shared/enums/error-severity';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'rtms-user-management-add',
    templateUrl: './user-management-add.component.html',
    styleUrls: ['./user-management-add.component.scss']
})

export class UserManagementAddComponent {

  public _pageTitle = 'Add User';
  public _userId = 0;
  public _userData: User = new User();
  public _timeZoneData: any[];
  public _staffTypeData: any[];
  public _errorMessages: any[];
  public greaterThanZeroPattern = '^[1-9][0-9]*$';
  public _dashboardTypes: Array<Dashboard> = [];
  public _submitted = false;

  private _currentEmailAddress: string;
  public confirmEmailAddressTitle: string;
  public confirmEmailAddressBody: string;

  @ViewChild('resetPasswordModal', {static: false}) public resetPasswordModal: TemplateRef<any>;
  @ViewChild('confirmEmailAddress', {static: false}) private confirmEmailAddress: ConfirmComponent;

  constructor(
    private modalService: NgbModal,
    private _stateService: StateService,
    private _userAdminService: UserAdminService,
    private _userInterfaceStateService: UserInterfaceStateService,
    private toastrService: ToastrService,
  ) {
    this._userId = this._stateService.params.userId;
    this.loadDashboardTypes();
    this.loadStaffTypes();
    this.loadTimeZones();
    this.loadUser();
    if (this._userId > 0) {
      this._pageTitle = 'Edit User';
    }
  }

  public async onSave(isValid): Promise<void> {
    this._errorMessages = [];

    if (isValid) {
      this.saveUser();
    }
  }

  public saveUser(warningAcknowledged = false) {
    const facId = Number(this._userData.OrganizationId);
    this._userData.SelectedOrganization = this._userData.Facilities.filter( item => item.OrganizationId === facId)[0];

    const timeZoneId = Number(this._userData.TimeZoneId);
    this._userData.TimeZone = this._timeZoneData.filter( item => item.TimeZoneId === timeZoneId)[0];

    const staffTypeId = Number(this._userData.StaffTypeId);
    this._userData.StaffType = this._staffTypeData.filter( item => item.StaffTypeId === staffTypeId)[0];

    this._userAdminService.saveUser(this._userData, warningAcknowledged).subscribe(response => {

      this.goSuccess();
    }, (error) => {
      if (error.status === 400) {
        const validationErrors: ValidationError[] = [];
        error.error.forEach(err => {
          validationErrors.push(new ValidationError(err));
        });
        const warnings = validationErrors.filter(e => e.Severity == ErrorSeverity.Warning);
        if (warnings.length) {
          this.showWarnings(warnings);
          return;
        }
        this._errorMessages = error.error;
      }
    });
  }

  private showWarnings(warnings: ValidationError[]): void {
    if (warnings.length === 1) {
      this.confirmEmailAddressTitle = 'Confirm Email Address';
      this.confirmEmailAddressBody = warnings[0].toDisplayString();
      this.confirmEmailAddress.Show();
    }
  }

  private async emailAddressIsInUse(): Promise<boolean> {

    return new Promise((resolve, reject) => {
      // no change to email address
      if (this._userData.EmailAddress.trim() === this._currentEmailAddress.trim()) {
        resolve(false);
        return;
      }

      this._userAdminService.getUserByEmailAddress(this._userData.EmailAddress).subscribe(res => {
        // email not being used
        if (!res) {
          resolve(false);
          return;
        }
        this.confirmEmailAddressTitle = 'Confirm Email Address';
        this.confirmEmailAddressBody = `The Email Address is currently in use by user ${res.NameFirst} ${res.NameLast}.
        Do you want to move this email address?`;
        this.confirmEmailAddress.Show();
        resolve(true);
      }, (error) => {
        if (typeof(error) == typeof(ValidationError)) {
          error.error.forEach(element => {
            this._errorMessages.push(new ValidationError(element));
          });
        } else {
          this._errorMessages.push(error.error);
        }
        reject(error);
      });
    });

  }

  public onConfirmMoveEmailAddress(): void {
    this.saveUser(true);
  }

  public onCancel(): void {
    this._stateService.transitionTo('home.userManagement');
  }

  toggleResetPasswordModel() {
    this.modalService.open(this.resetPasswordModal, { windowClass: 'modal-danger' });
  }

  resetPassword() {
    this._userAdminService.resetPassword(this._userData.UserId);
    this.closeModal();
  }

  closeModal() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  goSuccess(): void {
    if (this._userData.UserId === 0) {
      this.toastrService.success("User successfully added.");
    } else {
      this.toastrService.success("User successfully updated.");
    }
    this._stateService.transitionTo('home.userManagement');
  }

  loadStaffTypes() {
    this._userAdminService.getStaffTypes().subscribe((response) => {
      this._staffTypeData = response;
    });
  }

  loadTimeZones() {
    this._userAdminService.getTimeZones().subscribe((response) => {
      this._timeZoneData = response;
    });
  }

  loadUser() {
    this._userAdminService.getUser(this._userId).subscribe((response) => {
      this._userData = response;
      this._currentEmailAddress = this._userData.EmailAddress || '';
    });
  }

  loadDashboardTypes() {
    this._userAdminService.getDashboardTypes().subscribe(
      (response) => {
          this._dashboardTypes = response;
      }
  );
  }

  getErrorMessages(error: ValidationError): string {
    if (error.toDisplayString) {
      return error.toDisplayString();
    } else {
      return 'An unexpected error occurred';
    }
  }
}
