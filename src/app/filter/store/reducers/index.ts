import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { FilterState } from '../../store/states/filter-state';
import { SetFilterAction, FilterAction } from '../../store/actions';
import { FilterValues } from '../../filter-values';
import { OrganizationModel } from  '../../../shared/models/models-index';
import { CardFilter } from '../../../shared/models/card-filter';
import { ReportDataFilter } from 'src/app/shared/models/report-data-filter.model';
export const stateKey = 'filters';

export const reducers: ActionReducerMap<FilterState> = {
    organizations: createFilterReducer<OrganizationModel[], SetFilterAction<OrganizationModel[]>>([], FilterValues.Organizations),
    organizationFeatures: createFilterReducer<OrganizationModel[], SetFilterAction<OrganizationModel[]>>([], FilterValues.OrganizationFeatures),
    allowedOrganizationTypes: createFilterReducer<number[], SetFilterAction<number[]>>([], FilterValues.AllowedOrganizationTypes),
    selectedHsOrganization : createFilterReducer<OrganizationModel, SetFilterAction<OrganizationModel>>
                                                                    (null, FilterValues.SelectedHsOrganization),
    selectedEnterpriseOrganization : createFilterReducer<OrganizationModel, SetFilterAction<OrganizationModel>>
                                                                    (null, FilterValues.SelectedEnterpriseOrganization),
    isFilterApplied : createFilterReducer<boolean, SetFilterAction<boolean>>(false, FilterValues.IsFilterApplied),
    isDefault: createFilterReducer<boolean, SetFilterAction<boolean>>(false, FilterValues.IsDefault),
    filterSettings : createFilterReducer<string, SetFilterAction<any>>('', FilterValues.FilterSettings),
    isQMAverageDrillDown : createFilterReducer<boolean, SetFilterAction<boolean>>(false, FilterValues.IsQMAverageDrillDown),
    isQMNumerator : createFilterReducer<boolean, SetFilterAction<boolean>>(false, FilterValues.IsQMNumerator),
    isQMDenominator : createFilterReducer<boolean, SetFilterAction<boolean>>(false, FilterValues.IsQMDenominator),
    cardFilters : createFilterReducer<CardFilter[], SetFilterAction<CardFilter[]>>([], FilterValues.CardFilters),
    isEnterpriseDashboard : createFilterReducer<boolean, SetFilterAction<boolean>>(false, FilterValues.IsEnterpriseDashboard),
    isHSDashboard : createFilterReducer<boolean, SetFilterAction<boolean>>(false, FilterValues.IsHSDashboard),
    currentDashboardDataFilters : createFilterReducer<ReportDataFilter[], SetFilterAction<ReportDataFilter[]>>([], FilterValues.CurrentDashboardDataFilters),
};

export const reducerToken = new InjectionToken<ActionReducerMap<FilterState>>('RegisteredReducers');

export const reducerProvider = [
    {
        provide: reducerToken, useValue: reducers
    }
];

export function createFilterReducer<T, TAction extends FilterAction>(initialValue: T, filter: FilterValues) {
    return function (
        state = initialValue,
        action: TAction
        ) {
            switch (action.type) {
                case `SET_FILTER_${filter}`:
                    return (<SetFilterAction<T>>(action as any)).filterValue;
                case `CLEAR_FILTER_${filter}`:
                    return initialValue;
                default:
                    return state;
            }
        };
}
