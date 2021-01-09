import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { FilterState } from '../../store/states/filter-state';
import { SetFilterAction } from '../../store/actions';
import { FilterValues } from '../../filter-values';
import { FilterValueService, FiltersService } from '../../store/services/filters.service';
import { OrganizationModel } from '../../../shared/models/organization.model';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { ListsStateService } from '../../../lists/store/services/lists-state.service';
import { RtmsConstantService } from '../../../shared/services/rtms-constant.service';
import { FeatureService } from 'src/app/shared/services/feature.service';
import { DataService } from 'src/app/shared/services/data.service';
import { FilterStateService } from 'src/app/shared/services/filter-state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvService } from 'src/app/shared/environment/env.service';
import { FilterSettings } from 'src/app/shared/models/filter-settings';

describe('FiltersService', () => {
    let service: FiltersService;
    let store: Store<FilterState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                StoreModule.forRoot({
                    filters: combineReducers(reducers)
                })
            ],
            providers: [FiltersService, UserStateService, ListsStateService,
                        RtmsConstantService, FeatureService, DataService, FilterStateService, EnvService]
        });

        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
        service = TestBed.get(FiltersService);
    });

    it('Should set SelectedOrganization', () => {
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
        service.organizations.set(organizations);
        expect(store.dispatch).toHaveBeenCalledWith(new SetFilterAction(organizations, FilterValues.Organizations));
    });

    it('Should get SelectedOrganization', (done) => {
        const testValue = new OrganizationModel();
        testValue .OrganizationId = 1;
        testValue.OrganizationName = 'Org UnderDesk Knife';


        service.organizations.set([testValue]);
        service.organizations.getStream()
            .subscribe(val => {
                expect(val).toEqual([testValue]);
                done();
            });

    });

    it('Should get SelectedOrganization with no Observable', (done) => {
        const testValue = new OrganizationModel();
        testValue.OrganizationId = 1,
        testValue .OrganizationName = 'test';
        testValue.OrganizationType = 1;
        service.organizations.set([testValue]);
        expect(service.organizations.get()).toEqual([testValue]);
        done();
    });

    it('Should get SelectedOrganization of allowed types only', () => {
        store.dispatch(new SetFilterAction<number[]>([1], FilterValues.AllowedOrganizationTypes));

        const organization1 = new OrganizationModel();
        organization1.OrganizationId = 1,
        organization1.OrganizationName = 'test';
        organization1.OrganizationType = 1;

        const organization2 = new OrganizationModel();
        organization2.OrganizationId = 2,
        organization2.OrganizationName = 'test 2';
        organization2.OrganizationType = 2;

        service.organizations.set([organization1, organization2]);

        expect(service.organizations.get()).toEqual([organization1]);
    });

    it('Should get stream of SelectedOrganization of allowed types only', (done) => {
        store.dispatch(new SetFilterAction<number[]>([1], FilterValues.AllowedOrganizationTypes));

        const organization1 = new OrganizationModel();
        organization1.OrganizationId = 1,
        organization1.OrganizationName = 'test';
        organization1.OrganizationType = 1;

        const organization2 = new OrganizationModel();
        organization2.OrganizationId = 2,
        organization2.OrganizationName = 'test 2';
        organization2.OrganizationType = 2;

        service.organizations.set([organization1, organization2]);

        service.organizations.getStream()
            .subscribe(selectedOrganizations => {
                expect(selectedOrganizations).toEqual([organization1]);
                done();
            });
    });

    it('Should get first SelectedOrganization of allowed types only', () => {
        store.dispatch(new SetFilterAction<number[]>([1], FilterValues.AllowedOrganizationTypes));

        const organization1 = new OrganizationModel();
        organization1.OrganizationId = 1,
        organization1.OrganizationName = 'test';
        organization1.OrganizationType = 2;

        const organization2 = new OrganizationModel();
        organization2.OrganizationId = 2,
        organization2.OrganizationName = 'test 2';
        organization2.OrganizationType = 1;

        const organization3 = new OrganizationModel();
        organization3.OrganizationId = 2,
        organization3.OrganizationName = 'test 3';
        organization3.OrganizationType = 1;

        service.organizations.set([organization1, organization2, organization3]);

        expect(service.organizations.getFirstOrDefault()).toEqual(organization2);
    });

    it('Should get SelectedOrganization of any type if allowedTypes are not set', () => {
        store.dispatch(new SetFilterAction<number[]>([], FilterValues.AllowedOrganizationTypes));

        const organization1 = new OrganizationModel();
        organization1.OrganizationId = 1,
        organization1.OrganizationName = 'test';
        organization1.OrganizationType = 1;

        const organization2 = new OrganizationModel();
        organization2.OrganizationId = 2,
        organization2.OrganizationName = 'test 2';
        organization2.OrganizationType = 2;

        service.organizations.set([organization1, organization2]);

        expect(service.organizations.get()).toEqual([organization1, organization2]);
    });
});
