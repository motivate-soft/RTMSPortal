import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { EnvService } from '../environment/env.service';
import { OrganizationModel } from '../models/models-index';
import { list } from '../utility/list';


@Injectable()
export class FeatureService {

  constructor(private http: HttpClient, private envService: EnvService) { }

  public isFeatureEnabledForFacility(facility: any, feature: string) {
    let returnValue = false;

    if (facility !== undefined) {
      facility.Features.forEach((value, key) => {
        if (feature === value.FeatureName) {
          returnValue = true;
        }
      });
    }
    return returnValue;
  }

  public getOrgFeatures(organizationId: number) {
    const req = { 'OrganizationId': organizationId };
    const urlString = this.envService.api + 'features/get-org-features';
    return this.http.post(urlString, req)
            .pipe(
                map((response: any) => response.Item)
            );
  }

  public isRequiredFeaturesEnabledForFacility(facility: OrganizationModel[], requiredFeatures: string[]) {
    let returnValue = false;
    const featureEligibleOrganization = list(facility)
    .Where(a => list(requiredFeatures).All(f => list(a.Features).Any(x => x.FeatureName === f))).FirstOrDefault();
    if (featureEligibleOrganization) {
      returnValue = true;
    }
    return returnValue;
  }
}
