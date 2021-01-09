import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { tap } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../pages/login/login.service';
import { StateService } from '@uirouter/core';
import { EnvService } from '../../services/services-index';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService,
    private dataService: DataService,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private stateService: StateService,
    private envService: EnvService) { }

  errorMesage = 'Something happened that we have to look into. We\'re working on it and will have it resolved soon.';
  errorHeading = 'Error occurred';
  apiExlcusionPipeDelimitted = 'AuthenticateUsingToken';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const consumer = `${window.location.protocol}//${window.location.host}`;



    if (req.url.indexOf(this.envService.api) === 0) {
      const headers = {
        ['x-application']: consumer,
      };
      if (this.tokenService.getAsyncToken()) {
        headers['x-access-token'] = this.tokenService.getAsyncToken();
      }
      req = req.clone({
        setHeaders: headers
      });
    }

    return next.handle(req).pipe(
      tap(
        (response: any) => {

          if (req.url.indexOf('api') !== -1 && req.method !== 'GET' && response.type !== 0) {
            if ((!this.dataService.isResponseValid(response)
              || !this.dataService.isResponseBodyValid(response.body)) && response.status !== 204) {

              this.toastrService.error(this.errorHeading, this.errorMesage);
              throw new Error(response.url);
            } else {
              if (this.dataService.isResponseValid(response)
                && response.body && response.body.Success !== undefined && !response.body.Success) {

                this.toastrService.error(this.errorHeading, this.errorMesage);
              }
            }
          }
          return response;
        },
        (error: any) => {

          if (error.status === 403) {
            this.stateService.transitionTo('home.noFeatureAccess');
            return null;
          }

          if (error.status === 401) {
            this.loginService.setTokenExpired(true);
            this.loginService.clearSession(true);
            return null;
          }

          if (error && (error.status === 500 || error.status === 504)) {
            this.toastrService.error(this.errorHeading, this.errorMesage);
          }
          return error;
        }
      )
    );
  }
}
