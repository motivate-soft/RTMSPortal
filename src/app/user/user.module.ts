import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stateKey, reducerToken, reducerProvider } from '../user/store/reducers';
import { UserStateService } from '../user/store/services/user-state.service';

@NgModule({
  imports: [StoreModule.forFeature(stateKey, reducerToken)],
  providers: [
    UserStateService,
    reducerProvider
  ]
})
export class UserModule { }
