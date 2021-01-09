import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, ActionReducerMap } from '@ngrx/store';
import { UserState } from '../../user/store/states/user-state';
import { createSetValueReducer } from './createSetValueReducer';
import { getSingle, getStream, setValue } from './storeServiceHelper';
import { SetValueAction } from '../actions/SetValueAction';

export interface TestState {
    value: string;
}

describe('StoreServiceHelper', () => {
    const initialValue = 'Hello, World!';

    const reducers: ActionReducerMap<TestState> = {
        value: createSetValueReducer<string>(initialValue, 'Value'),
    };
    const selector = (state: TestState) => state.value;
    let store: Store<UserState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot(reducers)
            ]
        });

        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
    });

    it('Should get single value', () => {
        store.dispatch(new SetValueAction<string>('Value', initialValue));

        const value = getSingle(store, selector)();

        expect(value).toBe(initialValue);
    });

    it('Should get stream', (done: DoneFn) => {
        let expectedValue = initialValue;
        store.dispatch(new SetValueAction<string>('Value', initialValue));

        getStream(store, selector)()
            .subscribe({
                next: val => {
                    expect(val).toBe(expectedValue);

                    if (expectedValue === 'Foo Bar') {
                        done();
                    }
                }
            });

        expectedValue = 'Foo Bar';

        store.dispatch(new SetValueAction<string>('Value', expectedValue));
    });

    it('Should dispatch action', () => {
        setValue(store, val => new SetValueAction<string>('Value', val), 'world!');
        expect(store.dispatch).toHaveBeenCalledWith(new SetValueAction('Value', 'world!'));
    })
});
