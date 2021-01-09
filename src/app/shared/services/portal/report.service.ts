import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportModel } from '../../models/report.model';
import { FeatureService } from '../feature.service';
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilterSettings } from '../../models/filter-settings';
import { FiltersService } from '../../../filter/store/services/filters.service';
import { OrganizationModel } from '../../models/organization.model';
import { EnvService } from '../../environment/env.service';


@Injectable()
export class ReportService {
  constructor(
    private http: HttpClient,
    private featureService: FeatureService,
    private dataService: DataService,
    private filtersService: FiltersService,
    private envService: EnvService
  ) { }

  public getReportsList(type: string): any {
    const req = {
      dashboardType: type,
      OrganizationId: this.getOrganizationId().OrganizationId
    };

    const urlString = this.envService.api + 'reports/getreports';
    return this.http.post<any>(urlString, req)
      .pipe(
        map((response: any) => {
          if (response.Success) {
            return this.checkReportsFeatures(response.Items);
          }
        }));
  }

  public getOrganizationId(): OrganizationModel {
    return this.filtersService.organizations.getFirstOrDefault();
  }

  public getReportById(reportId: Number): Promise<ReportModel> {
    const req = { 'intRequest': reportId };

    return this.http.post<any>(this.envService.api + 'reports/getreportbyid', req)
      .toPromise()
      .then(data => data.Item);
  }

  public getPortalUsageReport(filter: any): Observable<any> {
    const urlString = this.envService.api + 'reports/getportalusagereport';
    return this.dataService.postForResponse(urlString, filter);
  }

  public getfacilityportalusagereport(): Observable<any> {
    const urlString = this.envService.api + 'reports/getfacilityportalusagereport';
    return this.dataService.getForResponse(urlString);
  }

  public getkeywordsReport(facId: number): Observable<any> {
    const req = { 'FacilityId': facId };
    const urlString = this.envService.api + 'reports/getkeywords';
    return this.dataService.postForResponse(urlString, req);
  }

  public getInformation(FacId: number, reportId: number): Observable<any> {
    const bir = {
      OrganizationId: FacId,
      ReportId: reportId
    };
    const urlString = this.envService.api + 'reports/getInformation';
    return this.dataService.postForItem(urlString, bir);
  }

  public getPendingTours(dashboardId: number, facId: number): Observable<any> {
    const bir = {
      DashboardId: dashboardId,
      OrganizationId: facId
    };
    const urlString = this.envService.api + 'reports/getpendingtours';
    return this.dataService.postForItems(urlString, bir);
  }

  public getTourSteps(tourId: number): Observable<any> {
    const req = { 'intRequest': tourId };
    const urlString = this.envService.api + 'reports/gettoursteps';
    return this.dataService.postForItems(urlString, req);
  }

  public saveTourUser(tour: any): Observable<any> {
    const urlString = this.envService.api + 'reports/savetouruser';
    return this.dataService.postForItem(urlString, tour);
  }

  public saveAllTourUsers(tours: any): Observable<any> {
    const urlString = this.envService.api + 'reports/savealltourusers';
    return this.dataService.postForItem(urlString, tours);
  }

  public getUtilizationScoreReport(filterSettings: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'reports/utilization-score';
    return this.dataService.postForResponse(urlString, filterSettings);
  }

  public checkReportsFeatures(lstReport: any): any {
    const selectedOrganization = this.filtersService.organizations.getFirstOrDefault();
    for (let i = lstReport.length - 1; i >= 0; i--) {
      if (lstReport[i].lstFeatures && lstReport[i].lstFeatures.length > 0) {
        let hasAccess = false;
        lstReport[i].lstFeatures.forEach((feature) => {
          if (this.featureService.isFeatureEnabledForFacility(selectedOrganization, feature.FeatureName)) {
            hasAccess = true;
          }
        });
        if (!hasAccess) {
          lstReport[i].isVisible = false;
        }
      }
    }
    return lstReport;
  }

}
