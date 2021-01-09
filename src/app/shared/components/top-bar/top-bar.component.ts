import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { UserModel } from 'src/app/shared/models/models-index';
import { BaseComponent } from '..';
import { StateService } from '@uirouter/core';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { FeatureService } from 'src/app/shared/services/feature.service';
import { NavigationService } from 'src/app/shared/services/portal/navigation.service';

@Component({
  selector: 'rtms-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent extends BaseComponent implements OnInit, OnDestroy {
   _userAdminEnabled: boolean;
   _loggedInUser: UserModel;
   _showTopBar: boolean;
   _topBarIsOpen: boolean;
  constructor(
    private _userStateService: UserStateService,
    private _userInterfaceStateService: UserInterfaceStateService,
    public _stateService: StateService,
    private _filtersService: FiltersService,
    private _featureService: FeatureService,
    public _navigationService: NavigationService
  ) {
    super();
   }

  ngOnInit() {
    this._topBarIsOpen = false;
    this._showTopBar = false;
    this.subscriptions.push(this._userStateService.getLoggedInUserStream()
    .subscribe(user => {
      setTimeout(() => {
        this._loggedInUser = user;
      });
    }));

    this.subscriptions.push(this._userInterfaceStateService.getShowTopBarStream().subscribe(showTopBar => {
      // To avoid Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
      setTimeout(() => {
        this._showTopBar = showTopBar;
      });
    }));

    this.subscriptions.push(this._filtersService.organizations.getOrganizationFeatureStream()
      .subscribe(orgList => {
          if (orgList && orgList.length > 0) {
              const facility = orgList[0];
              this._userAdminEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'PortalUserAdmin');
          }
    }));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  }
