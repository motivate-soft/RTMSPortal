import {ACTION_LOGOUT} from '../actions';
import { Action } from '@ngrx/store';

export function logoutMetaReducer(reducer) {
    return function(state, action: Action) {
        if (action.type === ACTION_LOGOUT) {
            state = undefined;
        }

        return reducer(state, action);
    };
}
