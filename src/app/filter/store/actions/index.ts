import { Action } from '@ngrx/store';
import { FilterValues } from '../../filter-values';

export interface FilterAction extends Action {
    filter: FilterValues;
 }

export class SetFilterAction<TValue> implements FilterAction {
    readonly type = `SET_FILTER_${this.filter}`;

    constructor(public filterValue: TValue, public filter: FilterValues) { }
}

export class ClearFilterAction implements FilterAction {
    readonly type = `CLEAR_FILTER_${this.filter}`;

    constructor(public filter: FilterValues) { }
}
