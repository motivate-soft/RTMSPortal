import { createSetValueReducer } from './createSetValueReducer';
import { SetValueAction } from '../actions/SetValueAction';

describe('Set Value reducer creator', () => {
    it('Should create reducer for the given type', () => {
        const reducer = createSetValueReducer<number>(0, 'SET_VALUE');
        const action = new SetValueAction<number>('SET_VALUE', 10);

        expect(reducer).toBeTruthy('Reducer should have been created');

        const value = reducer(0, action);

        expect(value).toBe(10);
    });
});
