import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EnvService } from '../../environment/env.service';


@Injectable()
export class LookUpDataService {

  constructor(
    private http: HttpClient,
     private envService: EnvService
  ) {
    // Using dataService here results in circular dependency.
    // Can be fixed once we get rid of filterStateService.ts

  }

  public getCategories(facilityId: number): Observable<any> {
    const urlString = this.envService.api + 'lookupdata/categories-by-organization';
    const baseRequest = {
      OrganizationId: facilityId
    };
    return this.http.post(urlString, baseRequest )
      .pipe(
        map((response: any) => response)
      );
  }

  public getUnits(facilityId: number): Observable<any> {
    const urlString = this.envService.api + 'lookupdata/units';
    const baseRequest = {
      OrganizationId: facilityId
    };
    return this.http.post(urlString, baseRequest)
      .pipe(
        map((response: any) => response.Items)
      );
  }

  public getPayers(facilityId: number): Observable<any> {
    const urlString = this.envService.api + 'lookupdata/payers';
    const baseRequest = {
      OrganizationId: facilityId
    };
    return this.http.post(urlString, baseRequest)
      .pipe(
        map((response: any) => response.Items)
      );
  }

  public validateDate(useSingleDate: boolean, startDate: Date, endDate: Date, reportId: number): Observable<any> {
    const urlString = this.envService.api + 'validation/validate-filter';
    const baseRequest = {
      UseSingleDate: useSingleDate,
      StartDate: startDate,
      EndDate: endDate,
      ReportId: reportId
    };
    return this.http.post(urlString, baseRequest)
      .pipe(
        map((response: any) => response.Item)
      );
  }

}
