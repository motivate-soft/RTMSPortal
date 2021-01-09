import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../services/services-index';

@Injectable()
export class ApplicationInfoService {

  constructor(
    private http: HttpClient,
    private envService: EnvService
  ) {

  }

  public getApplicationSettings(): Observable<any> {
    const urlString = this.envService.api + 'application-info/app-settings';
    return this.http.get<any>(urlString);
  }

}
