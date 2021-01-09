import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ExceptionLoggerService } from './exception-logger.service';

export class MockUserStateService {   
    public getLoggedInUser = {
        UserId: 1,
        FirstName: 'John',
        LastName: 'Doe',
        TimeZoneId: 1
    };
}

describe('ExceptionLoggerService', () => {
    let service: ExceptionLoggerService;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ExceptionLoggerService]
        })
      
        service = TestBed.get(ExceptionLoggerService);
      })

    /*it('toothy test', () => {
        expect(service.testName).toEqual('toothy');
        //let a = 1;
        //expect(a).toEqual(1);
      });*/

});
