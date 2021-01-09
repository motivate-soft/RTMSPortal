import { Injectable } from '@angular/core';
import { StateService } from '@uirouter/core';
import { NavigationService } from './navigation.service';
import { UserInterfaceStateService } from '../../../userInterface/store/services/userInterface-state.service';

@Injectable()
export class DirectUrlStateService {


    whiteListedUrls = ['home.financial', 'home.sso','home.clinical', 'home.rehospitalization', 'home.hs', 'home.pdpm',
    'home.facilityportalusagereport', 'home.portalusagereport', 'home.keywordreport', 'home.utilizationscorecard', 'home.portal-usage-non',
        'reports', 'reports-financial', 'reports-clinical', 'reports-qm', 'reports-rehosp', 'home.inbox', 'home.reportdashboard'];

  constructor(
    private navigationService: NavigationService,
    private stateService: StateService,
    private userInterfaceStateService: UserInterfaceStateService) {
  }

  public set(directState: any, directStateparams: any) {
    this.userInterfaceStateService.setReturnToState(directState);
    this.userInterfaceStateService.setReturnToStateParams(directStateparams);
  }

  public navigate() {
    if (this.userInterfaceStateService.getReturnToState() &&
        this.whiteListedUrls.indexOf(this.userInterfaceStateService.getReturnToState().name.toLowerCase()) > -1) {
      const url = this.userInterfaceStateService.getReturnToState().name;
      const params = this.userInterfaceStateService.getReturnToStateParams();
      this.userInterfaceStateService.setReturnToState(null);
      this.userInterfaceStateService.setReturnToStateParams(null);
      this.stateService.transitionTo(url, params);

    } else {
      this.navigationService.navigateSelectedOrganizationDashboard();
    }
  }
  get url(): string {
    return this.userInterfaceStateService.getReturnToState() ? this.userInterfaceStateService.getReturnToState().name : '';
  }

  get params(): string {
    return this.userInterfaceStateService.getReturnToStateParams();
  }
}
