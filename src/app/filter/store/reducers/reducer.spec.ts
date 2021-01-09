import { createFilterReducer } from '.';
import { FilterValues } from '../../filter-values';
import { SetFilterAction, ClearFilterAction } from '../../store/actions';
import { OrganizationModel } from '../../../shared/models/models-index';

describe('filter reducer creator', () => {

    it ('Should create reducer for the given filter type', () => {
        let organizations: Array<OrganizationModel>;
        organizations = [];
        const org = {
            OrganizationId : 1,
            OrganizationName : 'Test1',
            LandingPageRoute : '',
            OrganizationType : 1,
            Features : [],
            OrgLevel : 1
        }as OrganizationModel;

        organizations.push(org);

        const reducer = createFilterReducer([], FilterValues.Organizations);
        const action = new SetFilterAction(organizations, FilterValues.Organizations);

        const result = reducer(organizations, action);

        expect(result).toBe(organizations);

    });


    it ('Reducer Should handle clear action', () => {
        const initialValue = [];

        let organizations: Array<OrganizationModel>;
        organizations = [];
        const org = {
            OrganizationId : 1,
            OrganizationName : 'Test1',
            LandingPageRoute : '',
            OrganizationType : 1,
            Features : [],
            OrgLevel: 1
        }as OrganizationModel;
        organizations.push(org);
        const reducer = createFilterReducer(initialValue, FilterValues.Organizations);
        const action = new SetFilterAction(organizations, FilterValues.Organizations);
        reducer(initialValue, action);

        const clearAction = new ClearFilterAction(FilterValues.Organizations);
        const result = reducer(organizations, clearAction);

    });
});
