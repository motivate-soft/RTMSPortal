import { createSelector } from '@ngrx/store';
import { getFilters } from '../../store/selectors/getFilters';
import { FilterState } from '../../store/states/filter-state';
import { FilterValues } from '../../filter-values';

export const getFilterValue = createSelector(
  getFilters,
  (filterState: FilterState, filter: FilterValues) => filterState[filter]
);

export const getResMRNSelector = createSelector(
  (state: FilterState) => getFilterValue(state, FilterValues.FilterSettings),
  (state) => ( state && state.ResMRN ) ? state.ResMRN : null
)
