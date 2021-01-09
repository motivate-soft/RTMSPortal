import { createFeatureSelector, createSelector } from '@ngrx/store';
import { stateKey } from '../../store/reducers';
import { UserInterfaceState } from '../../store/states/userInterface-state';

export const getUserInterfaces = createFeatureSelector<UserInterfaceState>(stateKey);

export const getShowSideBar = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.showSideBar
);

export const getHideSideBarMenu = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.hideSideBarMenu
);

export const getIsSideBarExpanded = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.isSideBarExpanded
);

export const getShowTopBar = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.showTopBar
);

export const getVersion = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.version
);

export const getToState = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.toState
);

export const getReturnToState = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.returnToState
);

export const getToStateParams = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.toStateParams
);

export const getReturnToStateParams = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.returnToStateParams
);

export const getFromState = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.fromState
);

export const getSSOConnection = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.ssoConnection
);

export const getFromStateParams = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.fromStateParams
);

export const getShowSwitchOrgIcon = createSelector(
  getUserInterfaces,
  (userInterfacesState: UserInterfaceState) => userInterfacesState.showSwitchOrgIcon
);
