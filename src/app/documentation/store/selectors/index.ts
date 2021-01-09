import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentationState } from '../states/documentation-state';
import { stateKey } from '../../store/reducers';

export const getDirectoryDrillDown = createFeatureSelector<DocumentationState>(stateKey);


export const getDirectoryDrillDownHistory = createSelector(
  getDirectoryDrillDown,
  (documentationState: DocumentationState) => documentationState.directoryDrilldownHistory
);
