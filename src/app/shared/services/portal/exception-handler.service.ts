import { Injectable, ErrorHandler, Injector } from '@angular/core';
import {ExceptionLoggerService} from 'src/app/shared/services/portal/exception-logger.service';
import { ApplicationInsightsService } from '../application-insights.service';

@Injectable()
export class ExceptionHandlerService implements ErrorHandler {

  constructor(
    private _exceptionLoggerService: ExceptionLoggerService,
    private injector : Injector
    ) {
    }

  handleError(error: any) {
    this._exceptionLoggerService.logError (error);
    this.injector.get<ApplicationInsightsService>(ApplicationInsightsService).logException(error);
  }
}
