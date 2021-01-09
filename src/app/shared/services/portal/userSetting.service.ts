import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../data.service';
import { RtmsConstantService } from '../rtms-constant.service';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { map, tap } from 'rxjs/operators';
import { EnvService } from '../../services/services-index';

@Injectable()
export class UserSettingService {

  constructor(
    private dataService: DataService,
    private rtmsConstantService: RtmsConstantService,
    private userStateService: UserStateService,
    private envService: EnvService
  ) {

  }

  public getUserSettings(): Observable<any> {
    const urlString = this.envService.api + 'user/settings';
    return this.dataService.getForItems(urlString)
      .pipe(
        map((response: any) => {
          return this.parseSettings(response);
        }));
  }

  public getUserSettingByName(name: string): Observable<any> {
    const urlString = this.envService.api + 'user/settings/' + name;
    return this.dataService.getForItem(urlString);
  }

  public setUserSetting(name: string, value: boolean) {
    const userSettings = this.userStateService.getSettings();
    const setting = userSettings[name];
    if (setting.value !== value) {
      setting.value = value;
      setting.settingObj.SettingValue = value.toString();
      this.saveUserSetting(setting.settingObj).subscribe(() => {
      });
    }
  }

  public saveUserSetting(userSettings: any): Observable<any> {
    const urlString = this.envService.api + 'user/settings';
    return this.dataService.postForItem(urlString, userSettings);
  }

  private parseSettings(responseItems: any): any {
    const settings = {};

    responseItems.forEach((setting: any) => {
      settings[setting.SettingName] = {
        value: this.extractSettingValue(setting),
        settingObj: setting
      };
    });

    return settings;
  }

  private extractSettingValue(setting: any) {
    const settingTypes = this.rtmsConstantService.settingTypes;

    switch (setting.SettingType) {
      case settingTypes.Boolean:
        return (setting.SettingValue == null
          || setting.SettingValue === undefined) ? false : (setting.SettingValue.toLowerCase() === 'true');
      case settingTypes.Numeric:
        return (setting.SettingValue == null || setting.SettingValue === undefined) ? 0 : parseFloat(setting.SettingValue);
      default:
        return setting.SettingValue;
    }
  }

}
