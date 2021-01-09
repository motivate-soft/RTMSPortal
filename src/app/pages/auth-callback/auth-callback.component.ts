import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'rtms-authcallback',
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.handleAuthentication();
  }

}
