import { Injectable } from '@angular/core';
import { StateService } from '@uirouter/core';
import { PrincipalService } from './principal.service';
import { Idle } from '@ng-idle/core';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthorizationService {

  constructor(
    private stateService: StateService,
    private principalService: PrincipalService,
    private idle: Idle,
    private userInterfaceStateService: UserInterfaceStateService) { }

  public authorize(): Observable<any> {
      return this.principalService.identity(false)
        .pipe(tap(() => {
          const isAuthenticated = this.principalService.isAuthenticated();
          const toState: any = this.userInterfaceStateService.getToState();
          if (isAuthenticated && toState.name !== 'home.login') {
            this.idle.watch();
          } else {
            this.idle.stop();
          }
          if (toState.data && toState.data.Role) {
            if (!isAuthenticated) {
              this.userInterfaceStateService.setReturnToState(toState);
              this.userInterfaceStateService.setReturnToStateParams(this.userInterfaceStateService.getToStateParams());
              // send to the signin state
              this.stateService.go('home.login');
            }
          }
      }));
  }

}
