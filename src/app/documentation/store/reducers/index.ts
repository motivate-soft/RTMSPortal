import { ActionReducerMap } from '@ngrx/store';
import { createSetValueReducer } from '../../../store/services/createSetValueReducer';
import { DIRECTORY_DRILL_DOWN_HISTORY } from '../../store/actions';
import { DocumentationState } from '../states/documentation-state';
import { InjectionToken } from '@angular/core';
import { Directory } from 'src/app/shared/models/directory';

export const stateKey = 'documentation';

export const reducers: ActionReducerMap<DocumentationState> = {
  directoryDrilldownHistory: createSetValueReducer<Directory[]>([], DIRECTORY_DRILL_DOWN_HISTORY)
};

export const reducerToken = new InjectionToken<ActionReducerMap<DocumentationState>>('RegisteredReducers');

export const reducerProvider = [
  {
    provide: reducerToken, useValue: reducers
  }
];
