import { OrganizationModel } from './organization.model';

import { DataFilter } from './data-filter';

export interface FilterSettings {
  StartDate?: Date;
  EndDate?: Date;
  DayRange?: number;
  QMTypeIDs?: string;
  Units?: string;
  ShortStay?: boolean|number;
  UserTimeZoneId?: number;
  Payers?: string;
  Organization?: any;
  FilterType?: string;
  FilterValue?: string;
  Categories?: string;
  Type?: string;
  // if it could have any number of other properties, then we could define it like so
  // this can accept fields with any string as propName and any type as value.
  [propName: string]: any;
  IsDashboard?: boolean;
  IsFilterApplied?: boolean;
  ReportId?: number;
  IsDrillDown?: boolean;
  CardFilterSelectedValue?: number;

  // QMDashboardRequest
  RangeFilter?: number;
  Denominator?: boolean;
  Sort?: number;
  SortType?: string;

  // BaseQMDashboardRequest
  QMTypeID?: number;

  // RehospDashboardRequest
  ThirtySixtyNinety?: number;
  Diagnosis?: string;

  // ResidentScoreRequest
  ResMRN?: string;

  DashboardId?: number;
  DataFilters?: Array<DataFilter>;
  OnlyDischargedResidents?: boolean;

  Organizations?: Array<OrganizationModel>;
  UserStatuses?: Array<any>;
  OrganizationId?: Number;
  OrganizationName?: string;

  IsDetailDashboard?: boolean;

  AsOfDate?: Date;
  DisableTime?: boolean;
}
