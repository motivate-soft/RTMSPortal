import { SetValueAction } from '../actions/SetValueAction';

export function createSetValueReducer<T>(initialValue: T, name: string) {
    return function (
        state = initialValue,
        action: SetValueAction<T>
        ): T {
            switch (action.type) {
                case `SET_VALUE_${name}`:
                    return action.actionValue;
                default:
                    return state;
            }
        };
}
