import { Action } from '@ngrx/store';
import { SetValueAction } from '../../../store/actions/SetValueAction';
import { ReportInfo } from '../../../shared/models/report-info';
import { ChartDetail } from 'src/app/shared/models/chart-details';

export const DRILL_DOWN_HISTORY = 'DRILL_DOWN_HISTORY';
export const SELECTED_REPORT = 'SELECTED_REPORT';


export const drilldownHistoryAction = (value: ChartDetail[]) => new SetValueAction(DRILL_DOWN_HISTORY, value);
export const selectedReportAction = (value: ReportInfo) => new SetValueAction(SELECTED_REPORT, value);

