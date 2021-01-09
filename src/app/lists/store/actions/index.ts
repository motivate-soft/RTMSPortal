import { Action } from '@ngrx/store';
import { SetValueAction } from '../../../store/actions/SetValueAction';
import {
    OrganizationModel, EnumValue, QMType,
    FacilityUnit, Payer, Category
} from '../../../shared/models/models-index';
import { Dashboard } from 'src/app/shared/models/dashboard';


export const REPORT_GROUPS = 'REPORT_GROUPS';
export const QM_TYPES = 'QM_TYPES';
export const USER_HS_ORG = 'USER_HS_ORG';
export const USER_FACILITIES = 'USER_FACILITIES';
export const REPORT_ENUMS = 'REPORT_ENUMS';
export const USER_ORGANIZATIONS = 'USER_ORGANIZATIONS';
export const ORGANIZATION_TYPES = 'ORGANIZATION_TYPES';
export const UNITS = 'UNITS';
export const PAYERS = 'PAYERS';
export const CATEGORIES = 'CATEGORIES';
export const DASHBOARDS = 'DASHBOARDS';



export const SetReportGroupsAction = (value: EnumValue[]) => new SetValueAction(REPORT_GROUPS, value);
export const SetQmTypesAction = (value: QMType[]) => new SetValueAction(QM_TYPES, value);
export const SetUserHSOrganizationAction = (value: OrganizationModel[]) => new SetValueAction(USER_HS_ORG, value);
export const SetUserFacilitiesAction = (value: OrganizationModel[]) => new SetValueAction(USER_FACILITIES, value);
export const SetReportEnumsAction = (value: EnumValue[]) => new SetValueAction(REPORT_ENUMS, value);
export const SetUserOrganizationsAction = (value: OrganizationModel[]) => new SetValueAction(USER_ORGANIZATIONS, value);
export const SetOrganizationTypesAction = (value: EnumValue[]) => new SetValueAction(ORGANIZATION_TYPES, value);
export const SetUnits = (value: FacilityUnit[]) => new SetValueAction(UNITS, value);
export const SetPayers = (value: Payer[]) => new SetValueAction(PAYERS, value);
export const SetCategories = (value: Category[]) => new SetValueAction(CATEGORIES, value);
export const SetDashboards = (value: Dashboard[]) => new SetValueAction(DASHBOARDS, value);






