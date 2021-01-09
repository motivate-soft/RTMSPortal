import { Component, OnInit } from '@angular/core';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { WindowRefService } from 'src/app/shared/services/portal/window.service';
import { BaseComponent } from '../../shared/components';

@Component({
  selector: 'rtms-lockscreen',
  templateUrl: './lock-screen.component.html'
})
export class LockScreenComponent extends BaseComponent implements OnInit {

  constructor(
    private userStateService: UserStateService,
    private userInterfaceStateService: UserInterfaceStateService,
    private _win: WindowRefService) {
     super();
    }

  emailAddress = '';
  user = '';

  ngOnInit() {
    this.userInterfaceStateService.setShowSideBar(false);
    this.userInterfaceStateService.setShowTopBar(false);

   this.subscriptions.push(this.userStateService.getLoggedInUserStream()
      .subscribe(user => {
        if (user) {
          this.emailAddress = user.EmailId;
          if (user.FirstName === null || user.LastName === null) {
            this.user = user.EmailId;
          } else {
            this.user = user.FirstName + ' ' + user.LastName;
          }
        }
      }));
  }

  public closeLockScreen() {
    this._win.nativeWindow.history.back();
  }

}
