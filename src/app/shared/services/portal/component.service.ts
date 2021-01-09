import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../services/services-index';


@Injectable()
export class ComponentService {
    constructor(private _http: HttpClient, private envService: EnvService) { }


    getAllResidentsForResidentDashboard(filter:any): Promise<any> {
        return this._http.post<any>(this.envService.api + 'resident/resident-dashboard-get-all', filter)
            .toPromise()
            .then(function (data) {
                if(data.hasOwnProperty('Items')){
                    return data.Items;
                }
                return data.Item;
            });
    }
}