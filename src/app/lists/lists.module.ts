import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stateKey, reducerToken, reducerProvider } from '../lists/store/reducers';
import { ListsStateService } from '../lists/store/services/lists-state.service';

@NgModule({
  imports: [StoreModule.forFeature(stateKey, reducerToken)],
  providers: [
    ListsStateService,
    reducerProvider
  ]
})
export class ListsModule {

}
