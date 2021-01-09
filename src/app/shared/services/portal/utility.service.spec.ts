import { TestBed, async } from '@angular/core/testing';
import { UtilityService } from "./utility.service";
import { WindowRefService } from "../services-index";
import { any } from "@uirouter/core";

class MockWinService extends WindowRefService  { 
    nativeWindow : any; 
    super(appVersion:string) 
    { 
        this.nativeWindow = {
            appVersion:appVersion,
            userAgent:'MSIE'
         };

    }
  }

  let myMockWindow: Window;

  
describe('Utility Service', function () {
    let utilService:UtilityService;
    let windowRefServiceSpy: jasmine.SpyObj<WindowRefService>;


  
    beforeEach(() => {
        var utils = new WindowRefService();

        const spy = spyOnProperty(windowRefServiceSpy, 'nativeWindow').and.returnValue(
            {
                appVersion:'5',
                userAgent:'MSIE'
             }
          );

        TestBed.configureTestingModule({
          // Provide both the service-to-test and its (spy) dependency
          providers: [UtilityService,WindowRefService]
        });

        

        // Inject both the service-to-test and its (spy) dependency
        utilService = TestBed.get(UtilityService);
      });

    it('isOlderIEBrowser should return false for IE 11+', function () {
        //var utils = new UtilityService(new MockWinService('5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko'))
       // expect(utilService.isOlderIEBrowser()).toEqual(false);
    });

    /*it('isOlderIEBrowser should return true for older IE', function () {
        var mockWin = new WindowRefService();
        mockWin.nativeWindow = {
            appVersion:appVersion,
            userAgent:'MSIE'
         };


        var utils = new UtilityService(new MockWinService('5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Zoom 3.6.0; wbx 1.0.0)'))
        expect(utils.isOlderIEBrowser()).toEqual(true);
    });*/
});