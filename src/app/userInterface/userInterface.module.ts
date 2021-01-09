import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stateKey, reducerToken, reducerProvider } from './store/reducers';
import { UserInterfaceStateService } from './store/services/userInterface-state.service';

@NgModule({
  imports: [StoreModule.forFeature(stateKey, reducerToken)],
  providers: [
    UserInterfaceStateService,
    reducerProvider
  ]
})
export class UserInterfaceModule {

}
