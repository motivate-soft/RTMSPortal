import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { createSetValueReducer } from '../../../store/services/createSetValueReducer';
import { ListsState } from '../../store/states/lists-state';
// tslint:disable-next-line:max-line-length
import { REPORT_GROUPS, QM_TYPES, USER_HS_ORG, USER_FACILITIES, REPORT_ENUMS, USER_ORGANIZATIONS, ORGANIZATION_TYPES, UNITS, PAYERS, CATEGORIES, DASHBOARDS } from '../../store/actions';
import {
  OrganizationModel, QMType, EnumValue,
  FacilityUnit, Payer, Category
} from '../../../shared/models/models-index';
import { Dashboard } from 'src/app/shared/models/dashboard';


export const stateKey = 'lists';

export const reducers: ActionReducerMap<ListsState> = {
  reportGroups: createSetValueReducer<EnumValue[]>([], REPORT_GROUPS),
  qms: createSetValueReducer<QMType[]>([], QM_TYPES),
  userHSOrgs: createSetValueReducer<OrganizationModel[]>([], USER_HS_ORG),
  userFacilities: createSetValueReducer<OrganizationModel[]>([], USER_FACILITIES),
  reportEnums: createSetValueReducer<EnumValue[]>([], REPORT_ENUMS),
  userOrganizations: createSetValueReducer<OrganizationModel[]>([], USER_ORGANIZATIONS),
  organizationTypes: createSetValueReducer<EnumValue[]>([], ORGANIZATION_TYPES),
  units: createSetValueReducer<FacilityUnit[]>([], UNITS),
  payers: createSetValueReducer<Payer[]>([], PAYERS),
  categories: createSetValueReducer<Category[]>([], CATEGORIES),
  dashboards: createSetValueReducer<Dashboard[]>([], DASHBOARDS)
};

export const reducerToken = new InjectionToken<ActionReducerMap<ListsState>>('RegisteredReducers');

export const reducerProvider = [
  {
    provide: reducerToken, useValue: reducers
  }
];
