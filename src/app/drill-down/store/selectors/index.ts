import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DrillDownState } from '../../store/states/drill-down-state';
import { stateKey } from '../../store/reducers';

export const getDrillDown = createFeatureSelector<DrillDownState>(stateKey);


export const getDrillDownHistory = createSelector(
  getDrillDown,
  (drillDownState: DrillDownState) => drillDownState.drilldownHistory
);
