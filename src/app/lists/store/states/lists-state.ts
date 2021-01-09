import {
  OrganizationModel, EnumValue, QMType,
  FacilityUnit, Payer, Category
} from '../../../shared/models/models-index';
import { Dashboard } from 'src/app/shared/models/dashboard';

export interface ListsState {
  reportGroups: EnumValue[];
  qms: QMType[];
  userHSOrgs: OrganizationModel[];
  userFacilities: OrganizationModel[];
  reportEnums: EnumValue[];
  userOrganizations: OrganizationModel[];
  organizationTypes: EnumValue[];
  units: FacilityUnit[];
  payers: Payer[];
  categories: Category[];
  dashboards: Dashboard[];
}