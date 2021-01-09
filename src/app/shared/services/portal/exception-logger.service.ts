import { Injectable,  Injector } from '@angular/core';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { ExceptionLoggerModel } from 'src/app/shared/models/models-index';
import { EnvService } from '../../services/services-index';

@Injectable()
export class ExceptionLoggerService {

  private numberOfSecondsUntilExpired = 60;
  private TOKEN_KEY = 'exception_table';
  public testName = '';

  constructor(
    private  _injector: Injector,
    private envService: EnvService
    ) {}

  logError(error: any) {
    let storageExceptions = this.getExceptions();

    storageExceptions = this.removeExpiredExceptions(storageExceptions);

    if (! this.hasErrorBeenLoggedAlready(storageExceptions, error.message ? error.message : error )) {
      storageExceptions.push(new ExceptionLoggerModel(error.message ? error.message : error));
    }

    this.updateExceptions(storageExceptions);

    console.error(error);
  }

  private hasErrorBeenLoggedAlready(exceptions: Array<ExceptionLoggerModel>, errorMessage: string): boolean {
    return exceptions.filter(function(val) { return val.ErrorMessage === errorMessage; }).length > 0;
  }

  private updateExceptions(exceptions: Array<ExceptionLoggerModel>) {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(exceptions));
  }

  private removeExpiredExceptions(exceptions: Array<ExceptionLoggerModel>): Array<ExceptionLoggerModel> {
    const currentTime = new Date();
    const numberOfSecondsUntilExpired = this.numberOfSecondsUntilExpired;
    const updatedExceptions = exceptions.filter(function(val) { return (currentTime.getTime() - new Date(val.LogDate).getTime()) / 1000 <= numberOfSecondsUntilExpired; });

    return updatedExceptions;
  }

  private getExceptions(): Array<ExceptionLoggerModel> {
    let exceptions = JSON.parse(localStorage.getItem(this.TOKEN_KEY)) ;

    if (! exceptions) {
      exceptions = new Array<ExceptionLoggerModel>();
    }

    return exceptions;
  }
}
