import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducerToken, stateKey, reducerProvider } from '../documentation/store/reducers';
import { DocumentationStateService } from './store/services/documentation-state.service';

@NgModule({
  imports: [StoreModule.forFeature(stateKey, reducerToken)],
  providers: [
    DocumentationStateService,
    reducerProvider
  ]
})
export class DocumentationModule {

}
