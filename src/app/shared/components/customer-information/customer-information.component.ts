import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/pages/notification/notification.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { BaseComponent } from '../base.component';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { OrganizationModel } from '../../models/models-index';

@Component({
  selector: 'rtms-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss']
})

export class CustomerInformationComponent extends BaseComponent implements OnInit, OnDestroy {
  public _isSidebarExpanded = true;
  private _user: any;

  constructor(
    private _notificationService: NotificationService,
    private _userStateService: UserStateService,
    private _userInterfaceStateService: UserInterfaceStateService,
    private _filtersService: FiltersService ) {
      super();
    }

    @Input() message: string;

    ngOnInit() {
      this.subscriptions.push(this._userStateService.getLoggedInUserStream()
      .subscribe(user => {
        this._user = user;
      }));

      this.subscriptions.push(this._userInterfaceStateService.getIsSideBarExpandedStream().subscribe(isSidebarExpanded => {
        // To avoid Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
        setTimeout(() => {
          this._isSidebarExpanded = isSidebarExpanded;
        });
      }));

      this.subscriptions.push(this._filtersService.organizations.getStream()
      .subscribe(org => {
        if (this._user !== null && org && org.length > 0) {
          this.getNotificationData(org[0].OrganizationId);
        }
      }));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getNotificationData(orgId: number): void {
    this.message = '';
    this._notificationService.getCustomerMessageByOrg(orgId).subscribe((response: any) => {

      const _notifications = response;

      if (_notifications) {
        this.message = _notifications.Message;
      }
    });
  }

}
