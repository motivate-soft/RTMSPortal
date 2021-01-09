import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../data.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EnvService } from '../../services/services-index';
import { Dashboard } from '../../models/dashboard';
import { User } from '../../models/user';

@Injectable()
export class UserAdminService {

  private baseUrl: string;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private envService: EnvService
  ) {
    this.baseUrl = `${envService.api}user/admin/`;
  }

  public getUsers(): Observable<any> {
    return this.dataService.getForItems(`${this.baseUrl}users`);
  }

  public getUser(userId: number): Observable<any> {
    const req = { 'userId': userId };
    return this.dataService.postForItem(`${this.baseUrl}user`, req);
  }

  public getUserByEmailAddress(emailAddress: string): Observable<User> {
    return this.dataService.getForItem(`${this.baseUrl}get-user-by-email-address?emailAddress=${emailAddress}`);
  }

  public getStaffTypes(): Observable<any> {
    return this.dataService.getForItems(`${this.baseUrl}stafftypes`);
  }

  public getTimeZones(): Observable<any> {
    return this.dataService.getForItems(`${this.baseUrl}timezones`);
  }

  public saveUser(user: User, warningAcknowledged: boolean = false): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}save/${warningAcknowledged}`, user);
  }

  public toggleActive(userId: number): Observable<any> {
    const req = { 'UserId': userId };
    return this.http.post<any>(`${this.baseUrl}toggle-active`, req);
  }

  public resetPassword(userId: number) {
    const req = { 'UserId': userId };
    this.http.post<any>(`${this.baseUrl}reset-password`, req).subscribe(() => {
    });
  }

  public getDashboardTypes(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(`${this.baseUrl}dashboard-types`);
  }
}
