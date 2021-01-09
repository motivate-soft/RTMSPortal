import { Selector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SetValueAction } from 'src/app/store/actions/SetValueAction';

export function getSingle<TStore, TValue>(store: Store<TStore>, selector: Selector<Object, TValue>): () => TValue {
    return () => {
        let value: TValue;
        getStream(store, selector)()
            .pipe(take(1))
            .subscribe(v => value = v);

        return value;
    };
}

export function getStream<TStore, TValue>(store: Store<TStore>, selector: Selector<Object, TValue>): () => Observable<TValue> {
    return () => store.select(selector);
}

export function setValue<TStore, TAction, TValue>(store: Store<TStore>, action: (TValue) => SetValueAction<TValue>, value: TValue) {
    return store.dispatch(action(value));
}
