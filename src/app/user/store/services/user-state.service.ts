import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { List } from 'linqts';
import { UserState } from '../../store/states/user-state';
import { UserModel } from '../../../shared/models/user.model';
import { getLoggedInUser, getMarketingUrl, getSettings } from '../../store/selectors/getLoggedInUser';
import { getSingle, getStream, setValue } from '../../../store/services/storeServiceHelper';
import { loggedInUserAction, marketingUrlAction, SetUserSettingsAction } from '../../store/actions';
import { OrganizationModel } from '../../../shared/models/organization.model';
import { ListsStateService } from '../../../lists/store/services/lists-state.service';
import { RtmsConstantService } from '../../../shared/services/rtms-constant.service';
import { UserSetting } from '../../../shared/models/user-setting';
@Injectable()
export class UserStateService {
  constructor(private store: Store<UserState>,
    private listsService: ListsStateService,
    private rtmsConstantsService: RtmsConstantService
  ) { }

  public getLoggedInUser = getSingle<any, UserModel>(this.store, getLoggedInUser);
  public getLoggedInUserStream = getStream(this.store, getLoggedInUser);
  public getMarketingUrl = getSingle(this.store, getMarketingUrl);

  public getSettings = getSingle(this.store, getSettings);
  public getSettingsStream = getStream(this.store, getSettings);

  public setLoggedInUser = (loggedInUser: UserModel) => setValue(this.store, loggedInUserAction, loggedInUser);
  public setMarketingUrl = (marketingUrl: string) => setValue(this.store, marketingUrlAction, marketingUrl);
  public setSettings = (userSettings: UserSetting[]) => setValue(this.store, SetUserSettingsAction, userSettings);

  public getDefaultFacility(lstAllowedOrganizationTypes: number[]): OrganizationModel {
    let allowedOrganizationTypes = new List<number>(lstAllowedOrganizationTypes);

    let  allowedOrganization = new List<OrganizationModel>(this.listsService.getUserOrganizations())
    .Where(o => !allowedOrganizationTypes.Any() || allowedOrganizationTypes.Any(t => t === o.OrganizationType));

    let defaultFacility;
    const userSettings = this.getSettings();

    if (userSettings) {
      const defaultFacilitySetting = userSettings[this.rtmsConstantsService.settings.DefaultFacility];
      if (defaultFacilitySetting && defaultFacilitySetting.settingObj.SettingValue !== null) {
        defaultFacility = allowedOrganization.
        FirstOrDefault(f => f.OrganizationId === parseInt(defaultFacilitySetting.settingObj.SettingValue));
      }
    }

    if (!defaultFacility) {
      defaultFacility = allowedOrganization.FirstOrDefault();
    }

    return defaultFacility;
  }

  public getLoggedInUserDetail(): string {
    const loggedInUser = this.getLoggedInUser();
    if (loggedInUser.FirstName === null || loggedInUser.LastName === null) {
      return loggedInUser.EmailId;
    } else {
      return loggedInUser.FirstName + ' ' + loggedInUser.LastName;
    }
  }
}
