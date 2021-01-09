import { createFeatureSelector, createSelector } from '@ngrx/store';
import { stateKey } from '../../store/reducers';
import { ListsState } from '../../store/states/lists-state';

export const getLists = createFeatureSelector<ListsState>(stateKey);


export const getReportGroups = createSelector(
  getLists,
  (listsState: ListsState) => listsState.reportGroups
);

export const getQMLists = createSelector(
  getLists,
  (listsState: ListsState) => listsState.qms
);

export const getUserHSOrg = createSelector(
  getLists,
  (listsState: ListsState) => listsState.userHSOrgs
);

export const getUserFacilities = createSelector(
  getLists,
  (listsState: ListsState) => listsState.userFacilities
);

export const getReportEnums = createSelector(
  getLists,
  (listsState: ListsState) => listsState.reportEnums
);
export const getUserOrganizations = createSelector(
  getLists,
  (listsState: ListsState) => listsState.userOrganizations
);
export const getOrganizationTypes = createSelector(
  getLists,
  (listsState: ListsState) => listsState.organizationTypes
);
export const getUnits = createSelector(
  getLists,
  (listsState: ListsState) => listsState.units
);
export const getPayers = createSelector(
  getLists,
  (listsState: ListsState) => listsState.payers
);
export const getCategories = createSelector(
  getLists,
  (listsState: ListsState) => listsState.categories
);
export const getDashboards = createSelector(
  getLists,
  (listsState: ListsState) => listsState.dashboards
);