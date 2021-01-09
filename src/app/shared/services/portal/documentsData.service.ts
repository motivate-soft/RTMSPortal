import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { EnvService } from '../services-index';

@Injectable()
export class DocumentsDataService {
    constructor(
        private dataService: DataService,
        private envService: EnvService
    ) { }

    public getDirectory(directoryName: string): Observable<any> {
        const urlString = `${this.envService.api}documents/directory`;
        return this.dataService.postForItems(urlString, { "strRequest": directoryName });
    }

    public getFile(filePath: string): Observable<any> {
        const urlString = `${this.envService.api}documents/file`;
        return this.dataService.postForResponse(urlString, { "strRequest": filePath });
    }
}