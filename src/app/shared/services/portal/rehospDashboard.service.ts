import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../data.service';
import { FilterSettings } from '../../models/filter-settings';
import { EnvService } from '../../services/services-index';

@Injectable()
export class RehospDashboardService {

  constructor(
    private dataService: DataService,
    private envService: EnvService
  ) {

  }

  public getReadmissionRates(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/readmissionrates';
    return this.dataService.postForItem(urlString, filter);
  }

  public getReadmissionRatesByDiagnosis(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/readmissionratesbydiagnosis';
    return this.dataService.postForItem(urlString, filter);
  }

  public getReadmissionDetails(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/readmissiondetails';
    return this.dataService.postForItem(urlString, filter);
  }

  public getReadmissionDiagnosisDetails(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/readmissiondiagnosisdetails';
    return this.dataService.postForResponse(urlString, filter);
  }

  public getResidentScoringSummary(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/residentscoringsummary';
    return this.dataService.postForItem(urlString, filter);
  }

  public getResidentScoringDetail(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/residentscoringdetail';
    return this.dataService.postForResponse(urlString, filter);
  }

  public getDaysPerThousand(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/daysperthousandsummary';
    return this.dataService.postForItem(urlString, filter);
  }

  public getResidentScore(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/residentscore';
    return this.dataService.postForItem(urlString, filter);
  }

  public getDaysPerThousandDetail(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/daysperthousanddetails';
    return this.dataService.postForItem(urlString, filter);
  }

  public getDaysPerThousandTotal(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/daysperthousandtotal';
    return this.dataService.postForItem(urlString, filter);
  }

  public getAverageLOS(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/los-average';
    return this.dataService.postForItem(urlString, filter);
  }

  public getLOSDetail(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/los-detail';
    return this.dataService.postForResponse(urlString, filter);
  }

  public getReadmissionRatesByPrimaryDiagnosis(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/getreadmissionratesbyprimarydiagnosis';
    return this.dataService.postForItem(urlString, filter);
  }

  public getReadmissionsByPrimaryDiagnosesDetail(filter: FilterSettings): Observable<any> {
    const urlString = this.envService.api + 'rehospitalizationdashboard/getreadmissionsbyprimarydiagnosesdetail';
    return this.dataService.postForResponse(urlString, filter);
  }

}
