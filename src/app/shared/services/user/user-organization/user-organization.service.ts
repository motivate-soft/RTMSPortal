import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/shared/environment/env.service';
import { DataService } from '../../data.service';
import { OrganizationModel } from 'src/app/shared/models/models-index';
import { Observable } from 'rxjs';
import { UserOrganization } from 'src/app/shared/models/user-organization.model';


@Injectable()
export class UserOrganizationService {

    baseUrl: string;
    
    constructor(
        private dataService: DataService,
        private envService: EnvService
    ) {
        this.baseUrl = `${this.envService.api}user-organization/`;
    }

    public getAllByUserId(userId: number): Observable<OrganizationModel[]> {
        return this.dataService.getForItems<OrganizationModel>(`${this.baseUrl}get-all-by-user-id?userId=${userId}`);
    }

    public saveUserOrganization(userId: number, organizationId: number): Observable<UserOrganization> {
        return this.dataService.postForItem<UserOrganization>(`${this.baseUrl}`, { UserId: userId, OrganizationId: organizationId });
    }
}