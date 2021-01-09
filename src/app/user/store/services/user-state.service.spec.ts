import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { UserState } from '../../store/states/user-state';
import { loggedInUserAction } from '../../store/actions';
import { UserStateService } from '../../store/services/user-state.service';
import { UserModel } from '../../../shared/models/models-index';
import { ListsStateService } from '../../../lists/store/services/lists-state.service';
import { RtmsConstantService } from '../../../shared/services/rtms-constant.service';

describe('UserStateService', () => {
  let service: UserStateService;
  let store: Store<UserState>;
  let testUser: UserModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          user: combineReducers(reducers)
        })
      ],
      providers: [UserStateService, ListsStateService, RtmsConstantService]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    service = TestBed.get(UserStateService);

    testUser = {
      userId: 1,
      FirstName: 'John',
      LastName: 'Doe',
      TimeZoneId: 1,
      DashboardType: 'financial',
      EmailId: 'a@a.com',
      IsCorporateUser: false,
      IsSSO: false,
      OrganizationId: 1,
      UserName: 'duser',
      ReceptiveIoConfiguration: { VendorId: 1, Secret: 1 }
    } as UserModel;
  });

  it('Should set User', () => {
    service.setLoggedInUser(testUser);
    expect(store.dispatch).toHaveBeenCalledWith(loggedInUserAction(testUser));
  });

  it('Should get User stream', (done) => {
    service.setLoggedInUser(testUser);

    service.getLoggedInUserStream()
      .subscribe({
        next: val => {
          expect(val).toBe(testUser);

          if (val.userId === 2) {
            done();
          }
        }
      });

    testUser = {
      userId: 2,
      FirstName: 'Foo',
      LastName: 'Bar',
      TimeZoneId: 1,
      DashboardType: 'financial',
      EmailId: 'a@a.com',
      IsCorporateUser: false,
      IsSSO: false,
      OrganizationId: 1,
      UserName: 'user1',
      ReceptiveIoConfiguration: { VendorId: 1, Secret: 1 }
    } as UserModel;

    service.setLoggedInUser(testUser);
  });

  it('Should get User with no Observable', () => {
    service.setLoggedInUser(testUser);

    const result = service.getLoggedInUser();

    expect(result).toBe(testUser);
  });

});
