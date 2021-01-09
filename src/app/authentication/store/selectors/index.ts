import { AuthenticationState } from '../../../authentication/store/states/authentication-state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { stateKey } from '../../../authentication/store/reducers';


export const getAuthenticationToken = createFeatureSelector<AuthenticationState>(stateKey);


export const getAuthToken = createSelector(
    getAuthenticationToken,
    (authenticationState: AuthenticationState) => authenticationState.authToken
);

export const getTokenClaims = createSelector(
    getAuthenticationToken,
    (authenticationState: AuthenticationState) => authenticationState.tokenClaims
);
