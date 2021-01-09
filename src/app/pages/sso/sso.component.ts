import { OnInit, Component } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'rtms-sso',
  template: '<div>Loading...</div>'
})
export class SSOComponent implements OnInit {

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginService.redirectSSO('rtmsmail-waad');
  }

}
