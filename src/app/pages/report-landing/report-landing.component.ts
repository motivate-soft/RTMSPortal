import { Component, OnInit, Pipe } from '@angular/core';
import { ReportService } from 'src/app/shared/services/services-index';
import { ReportModel } from 'src/app/shared/models/report.model';
import { ReportGroup } from 'src/app/shared/models/report-group';
import { StateService } from '@uirouter/core';
import { ReportSearchFilterPipe } from 'src/app/shared/pipes';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { DrillDownStateService } from 'src/app/drill-down/store/services/drill-down-state.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { FilterDashboardService } from 'src/app/shared/services/portal/filter-dashboard.service';
import { SelectedChartStateService } from 'src/app/shared/services/selected-chart-state.service';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { ChartDetail } from 'src/app/shared/models/chart-details';
import { DocumentationStateService } from 'src/app/documentation/store/services/documentation-state.service';

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({
  name: 'reportSearchFilterPipe',
  pure: false
})

@Component({
  selector: 'rtms-report-landing',
  templateUrl: './report-landing.component.html',
  styleUrls: ['./report-landing.component.scss']
})
export class ReportLandingComponent implements OnInit {
  _searchQuery: string;
  _reportsList: Array<ReportModel>;
  _filteredReportsList: Array<ReportModel>;
  _reportGroupList: Array<ReportGroup>;
  dashboardId: number;

  constructor(
    private _reportService: ReportService,
    private _stateService: StateService,
    private _reportSearchFilterPipe: ReportSearchFilterPipe,
    private _utilizationMetricsService: UtilizationMetricsService,
    private _filtersService: FiltersService,
    private _filterDashboardService: FilterDashboardService,
    private _drillDownStateService: DrillDownStateService,
    private _selectedChartStateService: SelectedChartStateService,
    private _listsStateService: ListsStateService,
    private _documentationStateService: DocumentationStateService
  ) {
    this._selectedChartStateService.clearSelectedReport();
    this._drillDownStateService.clearDrillDownHistory();
    this._filterDashboardService.setInitialDateForRehospDashboard();
    this._documentationStateService.clearDirectoryDrillDownHistory();
  }

  ngOnInit() {
    this.dashboardId = this._listsStateService.getDashboardByName('Reports Landing').DashboardId;
    this._filtersService.resetFilter();
    this.loadReportGroups();
    this.getReportsList();
  }

  loadReportGroups() {
    const list: Array<ReportGroup> = [
      new ReportGroup({ Id: -1, Name: 'Recent Reports', IconClass: 'fa fa-heart' }),
      new ReportGroup({ Id: 3030, Name: 'PDPM Reports', IconClass: 'fas fa-file-medical-alt', Route: 'reports-pdpm' }),
      new ReportGroup({ Id: 2, Name: 'Clinical Reports', IconClass: 'fas fa-stethoscope', Route: 'reports-clinical' }),
      new ReportGroup({ Id: 1, Name: 'Financial Reports', IconClass: 'fa fa-dollar', Route: 'reports-financial' }),
      new ReportGroup({ Id: 20, Name: 'QM Reports', IconClass: 'fas fa-bullseye', Route: 'reports-qm' }),
      new ReportGroup({ Id: 34, Name: 'ProACT Reports', IconClass: 'fa fa-hospital-o', Route: 'reports-rehosp' }),
      new ReportGroup({ Id: 70, Name: 'Health System', IconClass: 'fas fa-hospital-symbol', Route: 'reports-hs'}),
      new ReportGroup({ Id: 8001, Name: 'Infection Control', IconClass: 'fas fa-shield-virus', Route: 'reports-infection-control'})
    ];

    this._reportGroupList = list;
  }

  getReportsList(): void {
    this._reportService.getReportsList(null).subscribe((response) => {
      this._reportsList = response;
      this._filteredReportsList = response;
    });
  }

  filterReportsByGroup(groupId): any {

    if (this._filteredReportsList) {
      return this._filteredReportsList.filter(x => x.ReportGroup === groupId);
    }

    return this._filteredReportsList;
  }

  groupHasReports(groupId): any {
    if (this._filteredReportsList) {
      return this._filteredReportsList.filter(x => x.ReportGroup === groupId).length > 0;
    }
    return false;
  }

  navigate(reportGroup: ReportGroup, report: ReportModel) {
    let reportRoute = reportGroup.Route;

    if (report.ReportDashboardId) {
      reportRoute = 'home.reportDashboard';
    }
    this._selectedChartStateService.setSelectedChartDetails({
      reportId:  Number(report.ReportId),
      chartName: report.ReportName,
      filter: this._filtersService.filterSettings.get(),
      returnsToRoute: reportRoute
    } as ChartDetail);

    this._utilizationMetricsService.recordLandingReportClick(report.ReportId, report.ReportName);
    if (report.ReportDashboardId) {
      const dashboard = this._listsStateService.getDashboardById(report.ReportDashboardId);
      this._stateService.transitionTo(reportRoute, {
        dashboardName: dashboard.DashboardRoute,
        category: dashboard.Category ? dashboard.Category : ''
      });
    } else {
      this._stateService.transitionTo(reportRoute, { 'report': report.ReportRoute, 'category': report.ReportId });
    }
  }

  onSearchChange(searchValue: string) {
    this._filteredReportsList = this._reportSearchFilterPipe.transform(this._reportsList, searchValue);
  }
}
