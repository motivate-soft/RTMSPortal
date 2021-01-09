import { createSelector } from '@ngrx/store';
import { getUser } from '../../store/selectors/getUser';
import { UserState } from '../../store/states/user-state';

export const getLoggedInUser = createSelector(
  getUser,
  (userState: UserState) => userState.loggedInUser
);

export const getMarketingUrl = createSelector(
  getUser,
  (userState: UserState) => userState.marketingUrl
);
export const getSettings = createSelector(
  getUser,
  (userState: UserState) => userState.settings
);

