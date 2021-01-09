import { OrganizationModel } from '../../../shared/models/organization.model';
import { FacilityUnit } from '../../../shared/models/facility-unit';
import { Payer } from '../../../shared/models/payer';
import { QMType } from '../../../shared/models/qm-type';
import { SelectOption } from '../../../shared/models/select-option';
import { Category } from '../../../shared/models/category';
import { DataFilter } from 'src/app/shared/models/data-filter';
import { CardFilter } from 'src/app/shared/models/card-filter';
import { ReportDataFilter } from 'src/app/shared/models/report-data-filter.model';

export interface FilterState {
  organizations: OrganizationModel[];
  allowedOrganizationTypes: number[];
  selectedHsOrganization: OrganizationModel;
  selectedEnterpriseOrganization: OrganizationModel;
  organizationFeatures: OrganizationModel[];


  isFilterApplied: boolean;
  isDefault: boolean;
  isQMNumerator: boolean;
  isQMDenominator: boolean;
  isQMAverageDrillDown: boolean;

  filterSettings: any;
  cardFilters: CardFilter[];

  isEnterpriseDashboard: boolean;
  isHSDashboard: boolean;
  currentDashboardDataFilters: Array<ReportDataFilter>;
}
