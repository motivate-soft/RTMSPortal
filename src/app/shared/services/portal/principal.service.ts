import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class PrincipalService {
  _identity = undefined;
  _authenticated = false;

  public isIdentityResolved() {
    return this._identity !== undefined && this._identity !== null;
  }

  public isAuthenticated() {
    return this._authenticated;
  }

  public isInRole(role) {
    if (!this._authenticated || !this._identity.Role) {
      return false;
    }
    return this._identity.Role === role;
  }

  public authenticate(identity) {
    this._identity = identity;
    this._authenticated = identity !== null;
  }

  public identity(force): Observable<any> {
    if (force === true) {
      this._identity = undefined;
    }
    if (this._identity !== undefined) {
      return of(this._identity);
    } else {
      this.authenticate(null);
      return of(this._identity);
    }
  }
}
