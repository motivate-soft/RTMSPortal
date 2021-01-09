import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getSingle, getStream, setValue } from '../../../store/services/storeServiceHelper';
import { UserInterfaceState } from '../states/userInterface-state';
import {
  getShowSideBar,
  getHideSideBarMenu,
  getShowTopBar,
  getIsSideBarExpanded,
  getVersion,
  getToState,
  getReturnToState,
  getToStateParams,
  getReturnToStateParams,
  getFromState,
  getSSOConnection,
  getFromStateParams,
  getShowSwitchOrgIcon,
} from '../selector';
import {
  SetShowSideBarAction,
  SetHideSideBarMenuAction,
  SetShowTopBarAction,
  SetIsSideBarExpandedAction,
  SetVersionAction,
  SetToStateAction,
  SetReturnToStateAction,
  SetToStateParamsAction,
  SetReturnToStateParamsAction,
  SetFromStateAction,
  SetSSOConnectionAction,
  SetFromStateParamsAction
} from '../actions';

@Injectable()
export class UserInterfaceStateService {
  constructor(private store: Store<UserInterfaceState>) { }

  public getShowSideBar = getSingle(this.store, getShowSideBar);
  public getShowSideBarStream = getStream(this.store, getShowSideBar);

  public getHideSideBarMenu = getSingle(this.store, getHideSideBarMenu);
  public getHideSideBarMenuStream = getStream(this.store, getHideSideBarMenu);

  public getShowTopBar = getSingle(this.store, getShowTopBar);
  public getShowTopBarStream = getStream(this.store, getShowTopBar);

  public getIsSideBarExpanded = getSingle(this.store, getIsSideBarExpanded);
  public getIsSideBarExpandedStream = getStream(this.store, getIsSideBarExpanded);

  public getVersion = getSingle(this.store, getVersion);
  public getVersionStream = getStream(this.store, getVersion);

  public getToState = getSingle(this.store, getToState);
  public getToStateStream = getStream(this.store, getToState);

  public getReturnToState = getSingle(this.store, getReturnToState);
  public getReturnToStateStream = getStream(this.store, getReturnToState);

  public getToStateParams = getSingle(this.store, getToStateParams);
  public getToStateParamsStream = getStream(this.store, getToStateParams);

  public getFromStateParams = getSingle(this.store, getFromStateParams);
  public getFromStateParamsStream = getStream(this.store, getFromStateParams);

  public getReturnToStateParams = getSingle(this.store, getReturnToStateParams);
  public getReturnToStateParamsStream = getStream(this.store, getReturnToStateParams);

  public getFromState = getSingle(this.store, getFromState);
  public getFromStateStream = getStream(this.store, getFromState);

  public getSSOConnection = getSingle(this.store, getSSOConnection);
  public getSSOConnectionStream = getStream(this.store, getSSOConnection);

  public getShowSwitchOrgIcon = getSingle(this.store, getShowSwitchOrgIcon);
  public getShowSwitchOrgIconStream = getStream(this.store, getShowSwitchOrgIcon);

  public setShowSideBar = (showSideBar: boolean) => setValue(this.store, SetShowSideBarAction, showSideBar);
  public setHideSideBarMenu = (hideSideBarMenu: boolean) => setValue(this.store, SetHideSideBarMenuAction, hideSideBarMenu);
  public setShowTopBar = (showTopBar: boolean) => setValue(this.store, SetShowTopBarAction, showTopBar);
  public setIsSideBarExpanded = (setIsSideBarExpanded: boolean) =>
            setValue(this.store, SetIsSideBarExpandedAction, setIsSideBarExpanded)
  public setVersion = (version: string) => setValue(this.store, SetVersionAction, version);
  public setToState = (toState: any) => setValue(this.store, SetToStateAction, toState);
  public setFromState = (fromState: any) => setValue(this.store, SetFromStateAction, fromState);

  public setReturnToState = (returnToState: any) => setValue(this.store, SetReturnToStateAction, returnToState);
  public setToStateParams = (toStateParams: any) => setValue(this.store, SetToStateParamsAction, toStateParams);
  public setReturnToStateParams = (returnToStateParams: any) => setValue(this.store, SetReturnToStateParamsAction, returnToStateParams);
  public setSSOConnection = (ssoConnection: any) => setValue(this.store, SetSSOConnectionAction, ssoConnection);
  public setFromStateParams = (fromStateParams: any) => setValue(this.store, SetFromStateParamsAction, fromStateParams);

  public toggleLoginStates(toggle: boolean) {
    this.setShowSideBar(toggle);
    this.setShowTopBar(toggle);
    this.setIsSideBarExpanded(toggle);
  }

}
