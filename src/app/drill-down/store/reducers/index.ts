import { ActionReducerMap } from '@ngrx/store';
import { createSetValueReducer } from '../../../store/services/createSetValueReducer';
import { DRILL_DOWN_HISTORY } from '../../store/actions';
import { DrillDownState } from '../../store/states/drill-down-state';
import { InjectionToken } from '@angular/core';
import { ChartDetail } from 'src/app/shared/models/chart-details';

export const stateKey = 'drilldown';

export const reducers: ActionReducerMap<DrillDownState> = {
  drilldownHistory: createSetValueReducer<ChartDetail[]>([], DRILL_DOWN_HISTORY)
};

export const reducerToken = new InjectionToken<ActionReducerMap<DrillDownState>>('RegisteredReducers');

export const reducerProvider = [
  {
    provide: reducerToken, useValue: reducers
  }
];
