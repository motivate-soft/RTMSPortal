import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../data.service';
import { FilterSettings } from '../../models/filter-settings';
import { EnvService } from '../../services/services-index';

@Injectable()
export class DashboardDataService {

  constructor(
    private dataService: DataService,
    private envService: EnvService
  ) {

  }

  public getDashboardConfig(data: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'dashboard/get-config';
    return this.dataService.postForItems(urlString, data);
  }

  public getResidentVitalsByCategory(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'resident/vitals-by-category';
    return this.dataService.postForItems(urlString, filter);
  }

  public getResidentLabHistory(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'resident/labs/history';
    return this.dataService.postForItems(urlString, filter);
  }

  public setIPAAlertSnooze(data: any): Observable<any> {
    const urlString = this.envService.api + 'pdpm/ipa-alert/snooze';
    return this.dataService.postForResponse(urlString, data);
  }
}
