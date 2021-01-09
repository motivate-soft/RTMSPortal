import { ActionReducerMap } from '@ngrx/store';
import { TourState } from '../states/tour-state';
import { createSetValueReducer } from 'src/app/store/services/createSetValueReducer';
import { CURRENT_TOUR } from '../action';
import { Tour } from 'src/app/shared/models/tour';
import { InjectionToken } from '@angular/core';

export const stateKey = 'tour';

export const reducers: ActionReducerMap<TourState>={

    currentTour: createSetValueReducer<Tour>(null, CURRENT_TOUR),    

}

export const reducerToken = new InjectionToken<ActionReducerMap<TourState>>('RegisteredReducers');

export const reducerProvider = [
  {
    provide: reducerToken, useValue: reducers
  }
];
