import { SetFilterAction } from '.';
import { FilterValues } from '../../filter-values';
import { OrganizationModel } from '../../../shared/models/organization.model';

describe('Set Filter Action', () => {
  let organizations: Array<OrganizationModel>;
  organizations = [];
  const org = {
    OrganizationId: 2,
    OrganizationName: 'Test1',
    LandingPageRoute: '',
    OrganizationType: 1,
    Features: [],
    OrgLevel: 1
  } as OrganizationModel;

  organizations.push(org);
  const action = new SetFilterAction(organizations, FilterValues.Organizations);

  it('should create action for passed filter type', () => {
    expect(action.type).toBe('SET_FILTER_organizations');
  });

  it('should set filter value action payload', () => {
    expect(action.filterValue).toBe(organizations);
  });
});
