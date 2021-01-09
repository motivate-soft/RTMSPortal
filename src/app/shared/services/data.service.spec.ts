import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { DataService } from '../services/data.service';
import { FilterStateService } from './filter-state.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { reducers } from 'src/app/filter/store/reducers';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { RtmsConstantService } from './rtms-constant.service';
import { FeatureService } from './feature.service';
import { LookUpDataService } from './portal/lookUpData.service';
import { EnvService } from '../../shared/services/services-index';


describe('dataService', () => {

  let dataService: DataService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const api = 'http://localhost:47503/api/v1.0/' ;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          filters: combineReducers(reducers)
        })
      ],
      providers: [DataService, FilterStateService, FiltersService, UserStateService,
         ListsStateService, RtmsConstantService, FeatureService, LookUpDataService, EnvService]
    });
    injector = getTestBed();
    dataService = injector.get(DataService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const url = api + 'reports/getpendingtours';

  const dummyUser: any = {
    Item: [
      { login: 'John' },
      { login: 'Doe' }
    ]
  };

  const dummyUsers: any = {
    Items: [
      { login: 'John' },
      { login: 'Doe' }
    ]
  };

  const dummyUsersoutput = [
    { login: 'John' },
    { login: 'Doe' }
  ];

  it('should create action for get item', () => {

    dataService.getForItem(url).subscribe((users: any) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsersoutput);
    });
    const req = httpMock.expectOne(`${url}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should create action for get items', () => {
    dataService.getForItems(url).subscribe((users: any) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsersoutput);
    });
    const req = httpMock.expectOne(`${url}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should create action for get response', () => {

    dataService.getForResponse(url).subscribe((users: any) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsersoutput);
    });

    const req = httpMock.expectOne(`${url}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsersoutput);
  });

  it('should create action for post item', () => {

    dataService.postForItem(url, dummyUser).subscribe((users: any) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsersoutput);
    });
    const req = httpMock.expectOne(`${url}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUser);
  });

  it('should create action for post items', () => {

    dataService.postForItems(url, dummyUsers).subscribe((users: any) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsersoutput);
    });
    const req = httpMock.expectOne(`${url}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUsers);
  });

  it('should create action for post response', () => {

    dataService.postForResponse(url, dummyUsersoutput).subscribe((users: any) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsersoutput);
    });

    const req = httpMock.expectOne(`${url}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUsersoutput);
  });

});
