import { createFeatureSelector, State } from '@ngrx/store';
import { UserState } from '../../store/states/user-state';
import { stateKey } from '../../store/reducers';

export const getUser = createFeatureSelector<UserState>(stateKey);
