import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../services/services-index';


@Injectable()
export class DashboardService {
    constructor(private _http: HttpClient, private envSerive: EnvService) { }


    getDataFromApi(filter: any, apiLocation: string): Promise<any> {
        if (filter) {
            return this._http.post<any>(this.envSerive.api + apiLocation, filter)
                .toPromise()
                .then(function (data) {
                    if (data.hasOwnProperty('Items')) {
                        return data.Items;
                    }
                    return data.Item;
                });
        } else {
            return this._http.get<any>(this.envSerive.api + apiLocation)
                .toPromise()
                .then(function (data) {
                    if (data.hasOwnProperty('Items')) {
                        return data.Items;
                    }
                    return data.Item;
                });

        }
    }
}
