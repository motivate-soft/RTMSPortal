import { SetValueAction } from '../../../store/actions/SetValueAction';

export const SHOW_SIDE_BAR = 'SHOW_SIDE_BAR';
export const HIDE_SIDE_BAR_MENU = 'HIDE_SIDE_BAR_MENU';
export const SHOW_TOP_BAR = 'SHOW_TOP_BAR';
export const VERSION = 'VERSION';
export const TO_STATE = 'TO_STATE';
export const RETURN_TO_STATE = 'RETURN_TO_STATE';
export const TO_STATE_PARAMS = 'TO_STATE_PARAMS';
export const RETURN_TO_STATE_PARAMS = 'RETURN_TO_STATE_PARAMS';
export const FROM_STATE = 'FROM_STATE';
export const FROM_STATE_PARAMS = 'FROM_STATE_PARAMS';
export const IS_SIDE_BAR_EXPANDED = 'IS_SIDE_BAR_COLLAPSED';
export const SSO_CONNECTION = 'SSO_CONNECTION';
export const SHOW_SWITCH_ORG_ICON = 'SHOW_SWITCH_ORG_ICON';

export const SetShowSideBarAction = (value: boolean) => new SetValueAction(SHOW_SIDE_BAR, value);
export const SetHideSideBarMenuAction = (value: boolean) => new SetValueAction(HIDE_SIDE_BAR_MENU, value);
export const SetShowTopBarAction = (value: boolean) => new SetValueAction(SHOW_TOP_BAR, value);
export const SetIsSideBarExpandedAction = (value: boolean) => new SetValueAction(IS_SIDE_BAR_EXPANDED, value);
export const SetVersionAction = (value: string) => new SetValueAction(VERSION, value);
export const SetToStateAction = (value: any) => new SetValueAction(TO_STATE, value);
export const SetReturnToStateAction = (value: any) => new SetValueAction(RETURN_TO_STATE, value);
export const SetToStateParamsAction = (value: any) => new SetValueAction(TO_STATE_PARAMS, value);
export const SetReturnToStateParamsAction = (value: any) => new SetValueAction(RETURN_TO_STATE_PARAMS, value);
export const SetFromStateAction = (value: any) => new SetValueAction(FROM_STATE, value);
export const SetFromStateParamsAction = (value: any) => new SetValueAction(FROM_STATE_PARAMS, value);
export const SetSSOConnectionAction = (value: string) => new SetValueAction(SSO_CONNECTION, value);
