import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { FilterState } from '../../store/states/filter-state';
import { SetFilterAction, ClearFilterAction } from '../../store/actions';
import { FilterValues } from '../../filter-values';
import { FilterValueService } from './../../store/services/filters.service';
import { OrganizationModel } from '../../../shared/models/organization.model';


describe('Filter Value Service', () => {
  let service: FilterValueService<OrganizationModel[]>;
  let store: Store<FilterState>;
  let organizations: Array<OrganizationModel>;
  organizations = [];
  const org = {
    OrganizationId: 1,
    OrganizationName: 'Test1',
    LandingPageRoute: '',
    OrganizationType: 1,
    Features: [],
    OrgLevel: 1,
    OrganizationTypeName: ''
  } as OrganizationModel;
  organizations.push(org);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          filters: combineReducers(reducers)
        })
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    service = new FilterValueService<OrganizationModel[]>(FilterValues.Organizations, store);
  });

  it('Set should dispatch action', () => {
    const action = new SetFilterAction([], FilterValues.Organizations);
    service.set(organizations);
    expect(store.dispatch).toHaveBeenCalledWith(new SetFilterAction(organizations, FilterValues.Organizations));
  });

  it('get should return observable with latest value', (done: DoneFn) => {

    service.set(organizations);

    organizations.push({
      OrganizationId: 2,
      OrganizationName: 'Test 2',
      LandingPageRoute: '',
      OrganizationType: 3,
      Features: [],
      OrgLevel: 1
    });
    service.set(organizations);

    const value = service.get();
    expect(value).toEqual(organizations);
    done();
  });

  it('get observable should stream changed values', (done: DoneFn) => {
    service.set(organizations);

    service.getStream().subscribe({
      next: val => {
        expect(val).toEqual(organizations);
        done();
      }
    });
    service.set(organizations);

  });

  it('clear should raise clear filter action', () => {
    service.clear();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearFilterAction(FilterValues.Organizations));
  });
});
