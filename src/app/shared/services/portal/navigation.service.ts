import { Injectable } from '@angular/core';
import { FiltersService } from '../../../filter/store/services/filters.service';
import { StateService } from '@uirouter/core';
import { take, filter } from 'rxjs/operators';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { RtmsConstantService } from '../rtms-constant.service';

@Injectable()
export class NavigationService {

  constructor(
    private userStateService: UserStateService,
    private stateService: StateService,
    private rtmsConstantService: RtmsConstantService) {

  }

  public navigateSelectedOrganizationDashboard() {
    const fac = this.userStateService.getDefaultFacility([this.rtmsConstantService.organizationTypes.Facility]);
    this.stateService.transitionTo(fac.LandingPageRoute, { reload: true });
  }

  public navigateToDashboard(org: any) {
    this.stateService.transitionTo(org.LandingPageRoute, { reload: true });
  }

}
