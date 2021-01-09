import { createFeatureSelector } from '@ngrx/store';
import { FilterState } from '../../store/states/filter-state';
import { stateKey } from '../../store/reducers';

export const getFilters = createFeatureSelector<FilterState>(stateKey);
