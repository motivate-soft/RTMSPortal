import { drilldownHistoryAction, DRILL_DOWN_HISTORY, SELECTED_REPORT, selectedReportAction } from '.';
import { ReportInfo } from '../../../shared/models/report-info';
import { ChartDetail } from 'src/app/shared/models/chart-details';

describe('Set Report Action', () => {


  it('should create action for selected report', () => {
    const reportInfo: ReportInfo = {
      chartName: 'Chart 1',
      reportId: 1,
      drillsIntoReportId: 11,
      selectedType: 'Data'
    };

    const actionForSelectedReport = selectedReportAction(reportInfo);

    expect(actionForSelectedReport.type).toBe(`SET_VALUE_${SELECTED_REPORT}`);
    expect(actionForSelectedReport.actionValue).toBe(reportInfo);
  });

  it('should create action for drill down history', () => {
    let lastReportDetails: ChartDetail[];
    lastReportDetails = [];
    lastReportDetails.push({
      filter: {
        ReportId: 1,
        StartDate: new Date(),
        OrganizationId: 1
      },
      chartName: 'Test Report 1',
      reportId: 1
    } as ChartDetail);

    const actionForDrillDown = drilldownHistoryAction(lastReportDetails);

    expect(actionForDrillDown.type).toBe(`SET_VALUE_${DRILL_DOWN_HISTORY}`);
    expect(actionForDrillDown.actionValue).toBe(lastReportDetails);
  });

});
