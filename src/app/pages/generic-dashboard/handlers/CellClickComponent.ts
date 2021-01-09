import { Injectable } from '@angular/core';
import { StateService } from '@uirouter/core';
import * as moment from 'moment';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { DashboardDataService } from 'src/app/shared/services/portal/dashboardData.service';
import { GenericDashboardFilterService } from 'src/app/shared/services/portal/genericDashboardFilter.service';
import { RtmsConstantService } from 'src/app/shared/services/rtms-constant.service';
import { SelectedChartStateService } from 'src/app/shared/services/selected-chart-state.service';
import { FilterStateService, ReportService } from 'src/app/shared/services/services-index';
import { UserStateService } from 'src/app/user/store/services/user-state.service';

@Injectable()
export class CellClickComponent {

    constructor(
        private dashboardDataService: DashboardDataService,
        private utilizationMetricsService: UtilizationMetricsService,
        private userStateService: UserStateService,
        private filterStateService: FilterStateService,
        private listsStateService: ListsStateService,
        private reportService: ReportService,
        private selectedChartStateService: SelectedChartStateService,
        private stateService: StateService,
        private genericDashboardFilterService: GenericDashboardFilterService,
        private rtmsConstantService: RtmsConstantService,
    ) {

    }

    public setIPAAlertSnooze(event, dashboardReport) {
      event.data.SnoozeDate = event.data.IsSnoozed ? null : moment().utc();
      this.dashboardDataService.setIPAAlertSnooze(event.data).subscribe((response) => {
        let alert = dashboardReport.data.seriesData.find(d => d.MDSId === event.data.MDSId && d.DateFound === event.data.DateFound);
          alert.SnoozeDate = event.data.SnoozeDate;
          alert.IsSnoozed = !alert.IsSnoozed;
          alert.RowClass = alert.IsSnoozed ? "row-disabled" : "";
        this.utilizationMetricsService.recordSetIPASnoozeDate(dashboardReport.ReportId, alert);
      });
    }

    public handlePdpmSummaryCellClick(event, dashboardReport, filterSettings) {
      filterSettings.IsDrillDown = true;
      filterSettings.DataFilters.push(this.genericDashboardFilterService.addDataFilter(this.rtmsConstantService.filterTypes.PDPMSummaryCategory, event.data.Label));
      this.filterStateService.setFilter(filterSettings);
      this.gridCellDrilldownByReportId(this.listsStateService.getReportEnumByName('PDPMSummaryDetail').Id, dashboardReport.data.detailDashboardId);
    }

    public handleQmDetailCellClick(event, dashboardReport, filterSettings) {
      filterSettings.user = this.userStateService.getLoggedInUserDetail();
      filterSettings.ShortStay = event.data.ShortStay;
      filterSettings.QMTypeID = event.data.QMTypeId;
      filterSettings.Sort = 1;
      this.filterStateService.setFilter(filterSettings);
      this.gridCellDrilldownByReportId(this.listsStateService.getReportEnumByName('QMDetail').Id, dashboardReport.data.detailDashboardId);

    }

    private gridCellDrilldownByReportId(reportId, detailDashboardId) {
      this.reportService.getReportById(reportId)
        .then((report) => {
          const details = {
            reportId: report.ReportId,
            chartName: report.ReportName,
            filter: this.filterStateService.getFilter()
          };
          this.selectedChartStateService.setSelectedChartDetails(details);
          this.navigateToDashboard('home.reportDashboard', this.listsStateService.getDashboardById(detailDashboardId));
        });
    }

    private navigateToDashboard(route, dashboard): void {
      this.stateService.go(route, {
        dashboardName: dashboard.DashboardRoute,
        category: dashboard.Category ? dashboard.Category : ''
      });
    }
}