import { Directory } from 'src/app/shared/models/directory';
import { SetValueAction } from '../../../store/actions/SetValueAction';

export const DIRECTORY_DRILL_DOWN_HISTORY = 'DIRECTORY_DRILL_DOWN_HISTORY';


export const directoryDrilldownHistoryAction = (value: Directory[]) => new SetValueAction(DIRECTORY_DRILL_DOWN_HISTORY, value);

