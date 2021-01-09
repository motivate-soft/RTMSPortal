import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stateKey, reducerToken, reducerProvider } from '../filter/store/reducers';
import { FiltersService } from '../filter/store/services/filters.service';

@NgModule({
    imports: [StoreModule.forFeature(stateKey, reducerToken)],
    providers: [
        FiltersService,
        reducerProvider
    ]
})
export class FilterModule { }
