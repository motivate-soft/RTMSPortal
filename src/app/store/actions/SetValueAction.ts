import { Action } from '@ngrx/store';

export class SetValueAction<TValue> implements Action {
    readonly type = `SET_VALUE_${this.name}`;

    constructor(public name: string, public actionValue: TValue) {
    }
}
