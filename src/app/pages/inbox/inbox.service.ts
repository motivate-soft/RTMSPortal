import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportService,ExportService, EnvService } from 'src/app/shared/services/services-index';
import { InboxModel,OrganizationModel,ReportModel } from 'src/app/shared/models/models-index';

@Injectable()
export class InboxService {
    constructor(
        private _http: HttpClient,
        private _reportService: ReportService,
        private _exportService: ExportService,
        private envService:EnvService 
    ) { }

    getScheduledReports(): Promise<any> {
        return this._http.get<any>(this.envService.api + 'reports/getreportexecutions')
            .toPromise()
            .then(data => data.Items);
    }
}
