import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../shared/services/data.service';
import { EnvService } from 'src/app/shared/environment/env.service';



@Injectable()
export class NotificationService {

  constructor(
    private dataService: DataService,
    private envService: EnvService
  ) {

  }

  public getNotification(): Observable<any> {
    const urlString = this.envService.api + 'notification/getNotification';
    return this.dataService.getForItems(urlString);
  }

  public getNotificationsByType(type: number): Observable<any> {
    const urlString = this.envService.api + 'notification/get-notifications-by-type';
    const req = { 'intRequest': type };
    return this.dataService.postForItems(urlString, req);
  }

  public getCustomerMessageByOrg(orgId: number): Observable<any> {
    const urlString = this.envService.api + 'notification/get-customer-message-by-org/' + name;
    const req = { 'OrganizationId': orgId };
    return this.dataService.postForItem(urlString, req);
  }
}
