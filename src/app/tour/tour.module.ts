import { NgModule } from '@angular/core';
import { TourStateService } from './services/tour-state.service';
import { reducerProvider, stateKey, reducerToken } from './reducers';
import { StoreModule } from '@ngrx/store';

@NgModule({
    imports: [StoreModule.forFeature(stateKey, reducerToken)],
    providers: [
      TourStateService,
      reducerProvider
    ] 
})
export class TourModule
{
   
}