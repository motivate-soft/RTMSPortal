import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../data.service';
import { FilterSettings } from '../../models/filter-settings';
import { EnvService } from '../../environment/env.service';

@Injectable()
export class QmReportService {

  constructor(
    private dataService: DataService,
    private envService: EnvService) {

  }


  public getQMTypes(): Observable<any> {
    const urlString = this.envService.api + 'qmreports/qm';
    return this.dataService.getForItems(urlString);
  }

}
