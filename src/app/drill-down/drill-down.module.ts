import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducerToken, stateKey, reducerProvider } from '../drill-down/store/reducers';
import { DrillDownStateService } from '../drill-down/store/services/drill-down-state.service';

@NgModule({
  imports: [StoreModule.forFeature(stateKey, reducerToken)],
  providers: [
    DrillDownStateService,
    reducerProvider
  ]
})
export class DrillDownModule {

}
