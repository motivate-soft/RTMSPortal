import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'rtms-logout',
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.logout();
  }

  public logout() {
    this.loginService.logout();
  }

}
