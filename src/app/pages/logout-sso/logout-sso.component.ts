import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/services-index';
import { LoginService } from '../login/login.service';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { Transition } from '@uirouter/angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'rtms-logout-sso',
  templateUrl: './logout-sso.component.html'
})
export class LogoutSSOComponent implements OnInit {

  isOlderBrowser = false;
  loginFailureMessage = '';

  constructor(private utilityService: UtilityService,
    private userInterfaceStateService: UserInterfaceStateService,
    private loginService: LoginService,
    private transition: Transition) { }

  ngOnInit() {
    this.isOlderBrowser = this.utilityService.isOlderIEBrowser();

    if (this.transition.params().loginFailure) {
      this.loginFailureMessage = 'Unable to Login. An error occurred during authorization.';
    }
  }

  public login() {
    this.loginService.redirectSSO(window.location.hash.replace('#',''));
  }

}
