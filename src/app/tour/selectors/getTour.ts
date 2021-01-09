import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TourState } from '../states/tour-state';
import { stateKey } from '../reducers';

export const tourState = createFeatureSelector<TourState>(stateKey);

export const getTour = createSelector(
    tourState,
    (tourState: TourState) => tourState.currentTour
  );

  
  