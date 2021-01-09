import { SetValueAction } from 'src/app/store/actions/SetValueAction';
import { Tour } from 'src/app/shared/models/tour';



export const CURRENT_TOUR='CURRENT_TOUR';

export const setTourAction = (value:Tour) => new SetValueAction(CURRENT_TOUR, value);
