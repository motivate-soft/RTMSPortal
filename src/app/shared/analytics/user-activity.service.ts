import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../shared/services/services-index';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { FilterDashboardService } from '../services/portal/filter-dashboard.service';

@Injectable()
export class UserActivityService {
  constructor(
    private angulartics2: Angulartics2,
    private http: HttpClient,
    private filterDashboadService: FilterDashboardService,
    private envService: EnvService,
    private userInterfaceStateService: UserInterfaceStateService
  ) {
  }

  startTracking(): void {
    this.angulartics2.pageTrack
      .pipe(this.angulartics2.filterDeveloperMode())
      .subscribe(x => this.pageTrack(x.path));
    this.angulartics2.eventTrack
      .pipe(this.angulartics2.filterDeveloperMode())
      .subscribe(x => this.eventTrack(x.action, x.properties));
  }

  pageTrack(path: string) {
    this.sendLogActivity(this.getClientPortalActivity(path, 'PageView', ''));
  }

  eventTrack(action: string, properties: any) {
    this.sendLogActivity(this.getClientPortalActivity(location.pathname, action, properties));
  }

  getClientPortalActivity(path, action, properties) {
    return {
      ActivityDate: new Date(),
      Route: path === '' ? null : path,
      Action: action,
      ActionReportId: properties === '' ? null : properties.category,
      ActionDetails: properties === '' ? null : properties.label || JSON.stringify(properties),
      OrganizationId: this.filterDashboadService.getSelectedOrganizationId()
    };
  }

  sendLogActivity(clientPortalActivity) {
    this.http.post(this.envService.api + 'application-info/add-client-portal-activity', clientPortalActivity)
      .subscribe(() => {});
  }
}
