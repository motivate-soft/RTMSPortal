import { UIEventTypes } from '../enums/ui-event-types';

export interface PortalUIEvent {
    type: UIEventTypes;
    value: any;
}
