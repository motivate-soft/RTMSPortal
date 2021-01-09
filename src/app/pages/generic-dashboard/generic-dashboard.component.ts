import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService } from '@uirouter/core';
import { SelectedChartStateService } from 'src/app/shared/services/selected-chart-state.service';
import { ChartDetail } from 'src/app/shared/models/chart-details';
import { UtilityService, FilterStateService, ReportService } from 'src/app/shared/services/services-index';
import { FilterDashboardService } from 'src/app/shared/services/portal/filter-dashboard.service';
import { DashboardDataService } from 'src/app/shared/services/portal/dashboardData.service';
import { FilterSettings } from 'src/app/shared/models/filter-settings';
import { DashboardService } from 'src/app/shared/services/portal/dashboard.service.';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { BaseComponent, ResidentCardScoreDetailComponent, ResidentLabResultsComponent } from 'src/app/shared/components';
import { ChartWidgetConfig } from 'src/app/shared/models/chart-widget-config';
import { FeatureService } from 'src/app/shared/services/feature.service';
import { CardFilterStateService } from 'src/app/shared/services/card-filter-state.service';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import * as moment from 'moment';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectedChartService } from '../../shared/services/selected-chart.service';
import { DrillDownStateService } from 'src/app/drill-down/store/services/drill-down-state.service';
import { list } from 'src/app/shared/utility/list';
import { RtmsConstantService } from 'src/app/shared/services/rtms-constant.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import * as _ from 'lodash';
import { RehospDashboardService } from 'src/app/shared/services/portal/rehospDashboard.service';
import { ResidentScoringDetail } from 'src/app/shared/models/resident-scoring-detail';
import { getRiskColor } from 'src/app/shared/utility/ui-helper';
import { GenericDashboardFilterService } from 'src/app/shared/services/portal/genericDashboardFilter.service';
import { DataFilter } from 'src/app/shared/models/data-filter';
import { ReportDataFilterStateService } from 'src/app/shared/services/report-data-filter-state.service';
import { FilterComponent } from 'src/app/shared/components/filter/filter.component';
import { DocumentationStateService } from 'src/app/documentation/store/services/documentation-state.service';
import { CellClickComponent } from './handlers/CellClickComponent';

@Component({
  selector: 'rtms-generic-dashboard',
  templateUrl: './generic-dashboard.component.html',
  styleUrls: ['./generic-dashboard.component.scss']
})
export class GenericDashboardComponent extends BaseComponent implements OnInit {
  hsDashboardRoute = 'home.hs';
  dashboardId: number;
  gridFullSize = false;
  category = '';
  delayAPICalls;
  isDetailDashboard = false;
  showBackButton = false;
  isReportDashboard = false;
  isCareTransitions = false;
  isResidentDashboard = false;
  isMdsDashDetail = false;
  isPDPMWorksheet = false;
  backButtonHref = '';
  dashboards = [];
  DashboardName = '';
  DashboardClass = '';
  DisplayName = '';
  IsShowFilter = false;
  selectedChartDetails: ChartDetail;
  showFooterDetails = false;
  endDateOfParentGrid;
  isAdminReports = false;
  isFacPortalUsage = false;
  isInfectionSurveillance = false;
  isKeywordAdminReport = false;
  hideFilterButton = false;
  hideFacilityDropdown = false;
  detailInfo = '';
  _residentScoreDetail: ResidentScoringDetail;
  @ViewChild('residentCardScoreDetailComponent', { static: false }) residentCardScoreDetailComponent: ResidentCardScoreDetailComponent;
  @ViewChild('residentLabResultsComponent', { static: false }) residentLabResultsComponent: ResidentLabResultsComponent;
  @ViewChild('rtmsFilter', { static: false }) rtmsFilter: FilterComponent;

  genericDashboardVM: any = {
    filterUnits: '',
    filterPayers: '',
    filterCategories: '',
    filterType: '',
    filterQMTypes: '',
    dischargeOnlyFilter: false,
    showMenu: false,
    showFilter: (allowHide: boolean) => {
      if (allowHide) {
        this.IsShowFilter = !this.IsShowFilter;
      } else {
        if (this.IsShowFilter === false) {
          this.IsShowFilter = !this.IsShowFilter;
        }
      }
    },
    removePayersFilter: () => {
      this.filterDashboardService.removeSelectedPayers();
      this.dashboardBuilderReload();
    },
    removeQMTypesFilter: () => {
      this.filterDashboardService.removeSelectedQMTypes();
      this.dashboardBuilderReload();
    },
    removeUnitsFilter: () => {
      this.filterDashboardService.removeSelectedUnits();
      this.dashboardBuilderReload();
    },
    removeDischargedOnlyFilter: () => {
      this.filterDashboardService.removeDischargeOnly();
      this.dashboardBuilderReload();
    },
    removeCategoriesFilter: () => {
      this.filterDashboardService.removeSelectedCategories();
      this.dashboardBuilderReload();
    },
    removeTypeFilter: () => {
      this.filterDashboardService.removeSelectedType();
      this.dashboardBuilderReload();
    },
    selectedOrganization: this.isHSDashboard() ?
      this.filterDashboardService.getHSFromFilterOrDefault()
      : this.genericDashboardFilterService.isEnterpriseDashboard() ?
        this.filterDashboardService.getEnterpriseFromFilterOrDefault()
        : this.filterDashboardService.getSelectedOrganization(),
    isHsDashboard: this.isHSDashboard()
  };
  hsOrgId: number;
  allFacsSelectedForDrilldown: boolean;
  showResetDetailsIcon: boolean;
  constructor(private stateService: StateService,
    private selectedChartStateService: SelectedChartStateService,
    private utilityService: UtilityService,
    private filterDashboardService: FilterDashboardService,
    private dashboardDataService: DashboardDataService,
    private dashboardService: DashboardService,
    private filtersService: FiltersService,
    private userInterfaceStateService: UserInterfaceStateService,
    private featureService: FeatureService,
    private cardFilterStateService: CardFilterStateService,
    private listsStateService: ListsStateService,
    private filterStateService: FilterStateService,
    private reportService: ReportService,
    private utilizationMetricsService: UtilizationMetricsService,
    private modalService: NgbModal,
    private selectedChartService: SelectedChartService,
    private drillDownStateService: DrillDownStateService,
    private rtmsConstantService: RtmsConstantService,
    private userStateService: UserStateService,
    private rehospDashboardService: RehospDashboardService,
    private genericDashboardFilterService: GenericDashboardFilterService,
    private reportDatafilterStateService: ReportDataFilterStateService,
    private documentationStateService: DocumentationStateService,
    private cellClickComponent: CellClickComponent) {
    super();
    this.filtersService.isEnterpriseDashboard.set(this.genericDashboardFilterService.isEnterpriseDashboard());
    this.filtersService.isHSDashboard.set(this.isHSDashboard());
    this.documentationStateService.clearDirectoryDrillDownHistory();
  }

  ngOnInit() {
    this.dashboardId = this.listsStateService.getDashboardIdByNameAndCategory
      (this.stateService.params.dashboardName, this.stateService.params.category);
    this.delayAPICalls = this.stateService.params.delayAPICalls;
    this.isDetailDashboard = this.stateService.params.isDetailDashboard;
    this.isReportDashboard = this.stateService.params.isReportDashboard ? this.stateService.params.isReportDashboard : false;
    this.isAdminReports = this.stateService.params.isAdminReports ? this.stateService.params.isAdminReports : false;
    this.showBackButton = this.stateService.params.showBackButton;
    this.isCareTransitions = (this.dashboardId ===
      this.listsStateService.getDashboardIdByNameAndCategory('care-transitions', 'care-transitions'));
    this.isResidentDashboard = (this.dashboardId ===
      this.listsStateService.getDashboardIdByNameAndCategory('resident-dashboard', 'resident-dashboard'));
    this.isInfectionSurveillance = (this.dashboardId ===
      this.listsStateService.getDashboardIdByNameAndCategory('infection-surveillance', 'reports-infection-control'));
    this.allFacsSelectedForDrilldown = true;
    if (this.isAdminReports || this.isInfectionSurveillance) { this.setFilterComponentInputs(); }

    if (this.showBackButton) {
      const selectedReport = this.selectedChartStateService.getSelectedReport();
      if (selectedReport) {
        this.selectedChartDetails = this.selectedChartStateService.getSelectedChartDetails
          (selectedReport.reportId) as ChartDetail;
      }
      if (this.isDetailDashboard) {
        const parentReportForCurrentDashboard = this.selectedChartStateService.getSelectedChartDetails();
        if (parentReportForCurrentDashboard) {
          this.backButtonHref = parentReportForCurrentDashboard.returnsToRoute;
        }
      } else {
        if (this.selectedChartDetails && this.selectedChartDetails.returnsToRoute && this.selectedChartDetails.returnsToRoute !== '') {
          this.backButtonHref = this.selectedChartDetails.returnsToRoute;
        } else {
          if (this.isReportDashboard) {
            this.backButtonHref = 'home.reportDashboard';
          }
        }
      }
    } else {
      this.selectedChartStateService.clearSelectedReport();
      this.drillDownStateService.clearDrillDownHistory();
      this.reloadFiltersWhenComingFromDifferentRoute();
    }
    if (this.isReportDashboard) {
      this.genericDashboardVM.retrieveParent = (event, args, indexOfBackReport) => {
        args.filter.IsDrillDown = indexOfBackReport >= 1 ? true : false;
        const currentFilter = this.filtersService.filterSettings.get();
        args.filter = { ...currentFilter, ...args.filter };
        this.filterStateService.setFilter(args.filter);

        const drillDownHistory = list(this.drillDownStateService.getDrillDownHistory()).ToArray();
        drillDownHistory.forEach((value, index) => {
          if (value.reportId === args.reportId) {
            this.drillDownStateService.removeItemFromHistory(index);
            this.selectedChartStateService.setSelectedChartDetails({
              reportId: args.reportId,
              chartName: args.chartName,
              filter: args.filter
            } as ChartDetail);
          }
        });
        this.navigateToDashboard('home.reportDashboard',
          this.listsStateService.getDashboardById(args.filter.DashboardId));
      };
    }
    this.hsOrgId = this.genericDashboardVM.selectedOrganization.OrganizationId;

    this.reloadDashboard();
    this.subscriptions.push(this.filtersService.getResMRN()
      .subscribe(val => {
        if (val !== null) {
          this.cardFilterStateService.clearCardFilters();
          this.unDelayAndReload();
        }
      }));
    this.subscriptions.push(this.filtersService.cardFilters.getStream()
      .subscribe(cardFilters => {
        if (cardFilters && cardFilters.length > 0) {
          const recentUpdated = cardFilters.find(filter => filter.isRecentUpdate === true);
          if (recentUpdated) {
            recentUpdated.isRecentUpdate = false;
            this.reloadChart(recentUpdated.reportId);
          }
        }
      }));
    this.subscriptions.push(this.filtersService.selectedHsOrganization.getStream()
      .subscribe(val => {
        if (val && val.OrganizationId && val.OrganizationId !== this.hsOrgId) { // only call this if we really have changed Orgs....
          this.hsOrgId = val.OrganizationId;
          this.filterDashboardService.removeSelectedPayers();
          this.reloadDashboard();
        }
      }));
  }

  showFilter() {
    return !this.isDetailDashboard && !this.hideFilterButton && !this.isKeywordAdminReport &&
      !this.isFacPortalUsage;
  }

  buildDashboard() {
    if (!this.isDetailDashboard && this.isDetailDashboard !== undefined) {
      this.cardFilterStateService.clearCardFilters();
    }
    this.modalService.dismissAll();
    this.showFooterDetails = false;
    const selectedOrganization = this.filtersService.organizations.getFirstOrDefault();
    if (this.stateService.current.data.requiresFeatures && this.stateService.current.data.requiresFeatures.length > 0) {
      if (!this.featureService.isRequiredFeaturesEnabledForFacility([this.genericDashboardVM.selectedOrganization],
        this.stateService.current.data.requiresFeatures) && (!this.genericDashboardVM.isHsDashboard) &&
        (!this.genericDashboardFilterService.isEnterpriseDashboard())) {
        this.stateService.transitionTo(this.genericDashboardVM.selectedOrganization.LandingPageRoute, { reload: true });
        return;
      }
    }
    const dashboardData: FilterSettings = {
      StartDate: new Date(),
      EndDate: new Date(),
      OrganizationId: this.genericDashboardVM.isHsDashboard ?
        this.hsOrgId : this.genericDashboardVM.selectedOrganization ? this.genericDashboardVM.selectedOrganization.OrganizationId : null,
      DashboardId: this.dashboardId
    };

    this.dashboardDataService.getDashboardConfig(dashboardData).subscribe(dashboards => {

      this.dashboards = dashboards;
      this.reportDatafilterStateService.clearReportDataFilters();
      this.dashboards.forEach(dashboardControl => {
        dashboardControl = this.buildChart(dashboardControl);
      });
    });

  }

  buildChart(dashboardControl) {
    this.DashboardName = dashboardControl.DashboardName;
    this.DisplayName = dashboardControl.DisplayName;
    this.category = dashboardControl.Category;
    this.DashboardClass = dashboardControl.DashboardClass;
    const data: any = {};
    let statusPromise: Promise<any>;
    data['reportId'] = dashboardControl.ReportId;

    if (this.isDetailDashboard || this.isReportDashboard || this.isAdminReports) {
      dashboardControl.AttributesList.forEach(attrs => {
        const attName = this.convertSnakeCaseToCamelCase(attrs.AttributeName);
        if (attrs.AttributeType === 'boolean') {
          data[attName] = attrs.AttributeValue === 'true' ? true : false;
        } else if (attrs.AttributeType === 'int') {
          data[attName] = Number(attrs.AttributeValue);
        } else if (attrs.AttributeType === 'string') {
          data[attName] = attrs.AttributeValue;
        }
        if (attName === 'hiddenCard' && data[attName]) {
          return;
        }
        if (attName === 'isFullWidth') {
          this.gridFullSize = data[attName];
        }
      });
    }

    dashboardControl.data = data;

    if (data.hiddenCard) {
      return;
    }
    this.isMdsDashDetail = data.cardType === 'mdsDashDetail';
    this.isPDPMWorksheet = data.cardType === 'pdpmWorksheet';

    this.filtersService.isEnterpriseDashboard.set(this.genericDashboardFilterService.isEnterpriseDashboard());
    this.filtersService.isHSDashboard.set(this.isHSDashboard());

    if (this.isDetailDashboard || this.isReportDashboard) {
      if (!this.selectedChartDetails) {

        const chartDetails = list(this.drillDownStateService.getDrillDownHistory())
          .Where(d => d.reportId === dashboardControl.ReportId).FirstOrDefault();
        this.selectedChartDetails = new ChartDetail();

        if (chartDetails && chartDetails.filter) {
          this.selectedChartDetails = chartDetails;
          chartDetails.filter.FilterValue = chartDetails.filter.series ? chartDetails.filter.series : chartDetails.filter.FilterValue;
          this.selectedChartDetails.filter.FilterValue = chartDetails.filter.FilterValue;
          this.selectedChartDetails.filter.FilterType = chartDetails.filter.FilterType;
          this.selectedChartDetails.category = chartDetails.filter.FilterValue;
          this.selectedChartDetails.reportId = chartDetails.reportId;
        }
      } else {
        const currentReport = this.selectedChartStateService.getSelectedChartDetails(dashboardControl.ReportId);
        if (currentReport) {
          if ((this.drilldownHistoryIndexOf(currentReport.reportId) < this.drilldownHistoryIndexOf(this.selectedChartDetails.reportId))
            || !this.isDetailDashboard) {
            this.selectedChartDetails = currentReport;
          }
        }
      }
    }

    if (dashboardControl.data.flipChartShow === false) {
      const selectedCard = this.dashboards.find(r => r.ReportId === this.selectedChartDetails.reportId);
      const flippedCard = this.dashboards.find(r => r.data.flipChartShow);
      if (selectedCard.ReportId !== flippedCard.ReportId && !flippedCard.data.flipCard) {
        return dashboardControl;
      }
    }

    this.detailInfo = '';
    const ssFilter = this.getFilterSettings(dashboardControl);
    if (ssFilter != null) {
      this.reportDatafilterStateService.setReportDataFilter(ssFilter.Reportid, ssFilter.DataFilters);
    }
    this.setFilterComponentInputs(dashboardControl.ReportId);
    if (this.detailInfo) { data['detailInfo'] = this.detailInfo; }
    if (ssFilter) {
      ssFilter.DashboardId = this.dashboardId;
      ssFilter.IsDetailDashboard = this.isDetailDashboard;
      data.exportFilter = ssFilter;
      if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('QMAverageCompare').Id) {
        data['chartName'] = ssFilter.ShortStay ? 'Resident Short Stay QMs' : 'Resident long Stay QMs';
      }
      if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosis').Id) {
        data['showResetDetailsIcon'] = this.showResetDetailsIcon;
      }
      if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('QMDetail').Id &&
        this.filtersService.isQMDenominator.get()) {
        dashboardControl.ControllerMethodName = 'denominators-with-outliers';
      }
    }
    if (this.showFooterDetails || !data['isFooterGrid']) {
      statusPromise = this.dashboardService.getDataFromApi(ssFilter,
        dashboardControl.ControllerName + '/' + dashboardControl.ControllerMethodName)
        .then(response => {


          if (this.isReportDashboard && response.Filter) {
            data['detailInfo'] = moment(response.Filter.EndDate).format('MM/DD/YYYY');
            this.handleReportEvents(response);
          }
          dashboardControl.AttributesList.forEach(attrs => {
            const attName = this.convertSnakeCaseToCamelCase(attrs.AttributeName);

            if (attrs.AttributeType === 'boolean') {
              data[attName] = attrs.AttributeValue === 'true' ? true : false;
            } else if (attrs.AttributeType === 'int') {
              data[attName] = Number(attrs.AttributeValue);
            } else if (attrs.AttributeType === 'string') {
              data[attName] = attrs.AttributeValue;
            } else {
              const value = eval('response.' + attrs.AttributeValue);
              if (attName === 'numberWidgetConfiguration' && data.allowOnClick) {
                if (this.selectedChartDetails && this.selectedChartDetails.filter &&
                  this.selectedChartDetails.filter.FilterValue && value && value.selectedItem) {
                  value.selectedItem.value = this.selectedChartDetails.filter.FilterValue;
                }
              }
              data[attName] = value;
            }
          });
          data['chartName'] = data['chartName'] ? data['chartName'] : response.ChartName;

          if (data.noDataMessageProp) {
            data.noDataMessage = response[data.noDataMessageProp];
          }

          response.ControlMap.forEach(map => {
            const attName = this.convertSnakeCaseToCamelCase(map.AttributeName);

            let value = eval('response.' + map.AttributeValue);
            if (attName === 'isWideCard') {
              value = (value === undefined || value === null) ? data[attName] : value;
            }
            if (attName === 'isShortCard') {
              value = (value === undefined || value === null) ? data[attName] : value;
            }
            if (attName === 'gridOptions') {
              data.options = {
                gridOptions: value
              };
              if (data['drillDownGridId']) {
                data.options.gridOptions.drillDownGridId = data['drillDownGridId'];
                data.options.gridOptions.selectedRow = null;
              } else if (data['detailDashboardId']) {
                data.detailDashboardId = data['detailDashboardId'];
                data.options.gridOptions.detailDashboardId = data['detailDashboardId'];
                data.options.gridOptions.selectedRow = null;
              }
              if (this.selectedChartDetails) {
                if (data.options.gridOptions) {
                  data.options.gridOptions.selectedRow = this.selectedChartDetails.selectedGridRow;
                  data.options.gridOptions.sorttype = this.selectedChartDetails.sortableGridColumn
                    ? this.selectedChartDetails.sortableGridColumn
                    : data.options.gridOptions.sorttype;

                  data.options.gridOptions.sortReverse = (this.selectedChartDetails.sortableGridColumnReverse !== undefined)
                    ? this.selectedChartDetails.sortableGridColumnReverse
                    : data.options.gridOptions.sortReverse;
                }
              }
              if (data['isFooterGrid']) {
                const filterSettings = this.filterStateService.getFilter();
                data.options.gridOptions.showFooterGrid = true;
                filterSettings.EndDate = this.endDateOfParentGrid;
                this.filterStateService.setFilter(filterSettings);
                if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ADLvsMDSScoreDetail').Id) {
                  if (data['seriesData'] && data['seriesData'].length > 0 && data['seriesData'][0].Resident) {
                    data['chartName'] = data['chartName'] + ' (' + data['seriesData'][0].Resident + ')';
                  }
                } else {
                  data['chartName'] = data.options.gridOptions.ChartName ? data.options.gridOptions.ChartName : data['chartName'];
                }
              } else {
                if (!(this.isMdsDashDetail && data['showHeader']) && !this.isReportDashboard) {
                  data['chartName'] = data.options.gridOptions.ChartName ? data.options.gridOptions.ChartName : data['chartName'];
                }
              }
              if (data.options.gridOptions) {
                data.options.gridOptions.tableId = data.options.gridOptions.tableId ? data.options.gridOptions.tableId
                  : '#gridId_' + dashboardControl.ReportId;
                data.options.gridOptions.templateid = data.options.gridOptions.templateid ? data.options.gridOptions.templateid
                  : 'gridId_' + dashboardControl.ReportId;
              }
            }

            data[attName] = value;
          });

          data.drilldownDestination = this.getDetailPageRoute(data.reportId);


          const cardTypeAttribute = dashboardControl.AttributesList.find(attr => attr.AttributeName === 'card_type');

          if (cardTypeAttribute.AttributeValue === 'bar' || cardTypeAttribute.AttributeValue === 'pie'
            || cardTypeAttribute.AttributeValue === 'line' || cardTypeAttribute.AttributeValue === 'horizontal-bar') {
            dashboardControl.data = this.prepareConfigObject(data);
          } else {
            dashboardControl.data = data;
          }
          if (!this.isDetailDashboard) {
            this.checkFilters();
          }
        });
    }

    if (data['disableTimeForFilterDate']) {
      this.rtmsFilter.enableTime = !data['disableTimeForFilterDate'];
    }

    if (dashboardControl.DashboardConfigProps && dashboardControl.DashboardConfigProps.DisableTimeForFilterDate) {
      this.rtmsFilter.enableTime = !dashboardControl.DashboardConfigProps.DisableTimeForFilterDate;
    }

    dashboardControl.data['statusPromise'] = statusPromise;
    return dashboardControl;
  }
  drilldownHistoryIndexOf(reportId: number): number {
    return this.drillDownStateService.getDrillDownHistory().
      findIndex(a => a.reportId === reportId);
  }
  isHSDashboard(): boolean {
    return (this.stateService.current.name === this.hsDashboardRoute || this.stateService.params.category === 'hs'
      || this.stateService.params.category === 'reports-hs');
  }

  reloadChart(reportId) {
    if (!this.allFacsSelectedForDrilldown && (reportId ===
      this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosis').Id
      || this.listsStateService.getReportEnumByName('FacilityPayerRatio').Id)
    ) {
      this.setAllFacilitiesMode(true, true);
    }
    if (this.isDetailDashboard) {
      this.showFooterDetails = false;
      this.dashboards.forEach(dashboardControl => {
        dashboardControl = this.buildChart(dashboardControl);
      });
    } else {
      this.dashboards.forEach(dashboardControl => {
        if (dashboardControl.data.reportId === reportId) {
          dashboardControl = this.buildChart(dashboardControl);
        }
      });
    }
  }

  reloadFiltersWhenComingFromDifferentRoute(): void {
    if (this.userInterfaceStateService.getFromState().name
      && this.userInterfaceStateService.getFromState().name !== this.userInterfaceStateService.getToState().name
      && this.userInterfaceStateService.getFromStateParams().category !== this.userInterfaceStateService.getToStateParams().category) {
      switch (this.dashboardId) {
        case 2:
        case 900: {
          this.filterDashboardService.setInitialDateForClinicalDashboard();
          break;
        }
        case 3: {
          this.filterDashboardService.setInitialDateForRehospDashboard();
          break;
        }
        case 504: {
          this.filterDashboardService.setInitialDateForUtilizationScore();
          break;
        }
        default: {
          this.filterDashboardService.setInitialDateForDashboard();
          break;
        }
      }

      this.filterDashboardService.removeSelectedUnits();
      this.filterDashboardService.removeSelectedPayers();
      this.drillDownStateService.clearDrillDownHistory();
      this.filtersService.isFilterApplied.set(false);
    }
  }

  gotoDetails(event): void {
    event = this.setDrilldownFilterDetails(event);

    if ((this.dashboardId === this.listsStateService.getDashboardIdByNameAndCategory('care-transitions', 'care-transitions')
      || this.dashboardId === this.listsStateService.getDashboardIdByNameAndCategory('resident-dashboard', 'resident-dashboard'))
    ) {
      this.setResidentCARDScorePopup(event);
    } else {
      const dashboardReport = this.getDashboardReportByReportId(this.selectedChartDetails.reportId);
      if (dashboardReport.data.drillDownType === 'footerDetails') {
        this.drillsIntoFooterDetails(dashboardReport.ReportId, dashboardReport.data.drillDownGridId, event);
      } else {
        this.drillsIntoDashboard(event);
      }
    }
  }

  setDrilldownFilterDetails(event) {
    if (this.isReportDashboard) {
      if (event.filter) {
        event.filter.DashboardId = this.dashboardId;
      } else {
        const filterSet = this.filtersService.filterSettings.get();
        filterSet.DashboardId = this.dashboardId;
        event.filter = filterSet;
      }
    }
    let currentClickedReport: ChartDetail;
    let clickedReportId: number;
    if (event.point && event.point.series.chart.options.reportId) {
      clickedReportId = event.point.series.chart.options.reportId;
    } else if (event.reportId) {
      clickedReportId = event.reportId;
    }
    if (clickedReportId) {
      currentClickedReport = this.selectedChartStateService.getSelectedChartDetails(clickedReportId);
      this.removeChildReportFromHistory(clickedReportId);
      if (currentClickedReport) {
        event.returnsToRoute = currentClickedReport.returnsToRoute;
      }
    }

    this.selectedChartStateService.setSelectedChartDetailsByEvent(event);
    this.selectedChartDetails = this.selectedChartStateService.getSelectedChartDetails
      (this.selectedChartStateService.getSelectedReport().reportId) as ChartDetail;

    return event;
  }

  drillsIntoFooterDetails(reportId, drillDownGridId, event) {
    this.showFooterDetails = false;
    this.modalService.dismissAll();
    this.dashboards.forEach(dashboardControl => {

      if (this.genericDashboardFilterService.isEnterpriseDashboard()
        && (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSProACTDaysPer1000').Id
          || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSProACTAdmissions1000').Id)) {
        dashboardControl.data.flipCard = true;
      }

      if (reportId === this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosis').Id && drillDownGridId) {
        if (dashboardControl.data.reportId === drillDownGridId) {
          this.setAllFacilitiesMode(false, false);
        }
      } else {
        if (dashboardControl.data.reportId === this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosis').Id
          || dashboardControl.data.reportId === this.listsStateService.getReportEnumByName('FacilityPayerRatio').Id) {
          this.setAllFacilitiesMode(false, false);
          dashboardControl.data['showResetDetailsIcon'] = this.showResetDetailsIcon;
          this.selectedChartDetails.filter.series = this.selectedChartDetails.series;
        }
        if (reportId === this.listsStateService.getReportEnumByName('FacilityReadmissionsByPrimaryDiagnosis').Id) {
          this.setAllFacilitiesMode(true, true);
        }
      }

      if (dashboardControl.SortOrder >= this.dashboards.find(x => x.ReportId === this.selectedChartDetails.reportId).SortOrder && drillDownGridId) {
        if (dashboardControl.data.reportId === drillDownGridId) {
          if (dashboardControl.data.isFooterGrid) {
            this.showFooterDetails = true;
          }
          this.endDateOfParentGrid = event.filter.EndDate;
          dashboardControl = this.buildChart(dashboardControl);
        }
      }
      else if (dashboardControl.data.reportId !== this.selectedChartDetails.reportId && !drillDownGridId) {
        if (dashboardControl.ReportId !== this.listsStateService.getReportEnumByName('AverageHospitalizationDaysPer1000').Id
          && dashboardControl.ReportId !== this.listsStateService.getReportEnumByName('AverageAdmissionsPer1000').Id
          && dashboardControl.ReportId != reportId) {
          dashboardControl = this.buildChart(dashboardControl);
        }
      }
    });
  }

  drillsIntoDashboard(event) {
    if (this.isReportDashboard) {
      this.selectedChartDetails.filter.IsDrillDown = true;
    } else {
      this.selectedChartDetails.returnsToRoute = 'genericDashboard/' + this.dashboardId;
      this.selectedChartStateService.setSelectedChartDetails(this.selectedChartDetails);
    }
    let reportId = 0;
    if (this.selectedChartDetails !== null) {
      reportId = (this.selectedChartDetails as ChartDetail).reportId;
    }
    const detailDashboardId = this.dashboards.find(d => d.ReportId === reportId).data.detailDashboardId;
    const reportName = event.point ? event.point.series.chart.options.name : event.chartName;
    let route = this.isReportDashboard ? 'home.reportDashboard' : 'home.detailDashboard';
    const dashboard = this.listsStateService.getDashboardById(detailDashboardId);
    if (detailDashboardId && dashboard) {
      this.navigateToDashboard(route, dashboard);
    } else {
      route = this.getDetailPageRoute(reportId);
      this.stateService.go(route, {
        report: this.utilityService.getRouteFromReportName(reportName)
      });
    }
  }

  removeChildReportFromHistory(reportId: number): void {
    const clickedReportIndex = this.drilldownHistoryIndexOf(reportId);
    if (clickedReportIndex >= 0) {
      this.drillDownStateService.removeItemFromHistory(clickedReportIndex + 1);
    }
  }

  reloadDashboard(): void {
    this.checkFilters();
    if (this.delayAPICalls) { return; }
    this.buildDashboard();
  }

  dashboardBuilderReload(): void {
    if (this.isReportDashboard || this.isAdminReports && !this.isCareTransitions && !this.isResidentDashboard) {
      this.reloadDashboard();
    } else {
      this.stateService.reload();
    }
  }

  unDelayAndReload(): void {
    this.delayAPICalls = false; /// just run the first time, to allow a filter or something else to fire
    this.reloadDashboard();
  }

  checkFilters(): void {
    this.genericDashboardVM.filterUnits = this.filterDashboardService.getSelectedUnits();
    this.genericDashboardVM.filterPayers = this.filterDashboardService.getSelectedPayers();
    this.genericDashboardVM.filterCategories = this.filterDashboardService.getSelectedCategories();
    this.genericDashboardVM.filterType = this.filterDashboardService.getSelectedTypes();
    this.genericDashboardVM.dischargeOnlyFilter = this.filterDashboardService.getDischargeOnly();

    const qmDetailsReport = list(this.drillDownStateService.getDrillDownHistory()).Where(a => a.reportId ===
      this.listsStateService.getReportEnumByName('QMDetail').Id).FirstOrDefault();
    if (qmDetailsReport) {
      const filterQMData = _.filter(this.listsStateService.getQMs(), (qm) => {
        return qm.QMTypeId === qmDetailsReport.filter.QMTypeID;
      });
      if (filterQMData && filterQMData.length > 0) {
        this.genericDashboardVM.filterQMTypes = filterQMData[0].QMTypeDesc;
      } else {
        this.genericDashboardVM.filterQMTypes = '';
      }
    } else {
      this.genericDashboardVM.filterQMTypes = this.filterDashboardService.getSelectedQMTypes();
    }
  }

  prepareConfigObject(data: any): any {
    data.chartConfig = {
      ReportId: data.reportId,
      name: data.chartName,
      HasData: data.hasData,
      disableExport: data.exportDisabled,
      isMarketingMode: data.isMarketingMode,
      dataLabels: {
        show: data.chartConfig ? data.chartConfig.showDataLabels : undefined,
        formatter: data.chartConfig ? data.chartConfig.formatter : undefined
      },
      axis: {
        xAxis: {
          data: data.axisData,
          isDate: data.isAxisDate,
          format: data.xaxisFormat
        },
        yAxis: {
          MaxYAxis: data.maxYAxis,
          IsYAxisPercent: data.isYAxisPercent,
          secondaryAxis: {
            enabled: data.secondaryChartOptions ? data.secondaryChartOptions.isDualAxis : undefined,
            max: data.secondaryChartOptions ? data.secondaryChartOptions.secondaryYAxisMax : undefined,
            isPercentage: data.secondaryChartOptions ? data.secondaryChartOptions.isSecondaryYAxisPercent : undefined,
            markerEnable: data.secondaryChartOptions ? data.secondaryChartOptions.markerEnable : undefined,
          }

        }
      },
      stacking: data.stacking,
      tooltipFormat: data.tooltipFormat,
      credit: {
        text: data.creditText,
        align: data.cardType === 'line' ? 'center' : 'right',
        enabled: true
      },
      blockSelectedPointColor: data.BlockSelectedPointColor !== true ? false : true,
      showLegend: !data.doNotShowLegend,
      DrillsIntoReportId: data.drillsIntoReportId,
      chartType: data.cardType === 'bar' ? 'column' : (data.cardType === 'horizontal-bar' ? 'bar' : data.cardType),
      FilterType: data.filterType,
      isHalfDonut: data.isHalfDonut,
      showInDatalabels: data.showInDatalabels,
      showInLegend: data.showInLegend,
      colorPalette: data.colorPalette ? data.colorPalette.split(',') : [],
      size: data.size ? data.size : undefined,
      colorByPoint: data.colorByPoint
    } as ChartWidgetConfig;

    return data;
  }

  getDetailPageRoute(reportId: number): string {
    if (reportId !== undefined) {
      let controllerName = this.getDashboardReportByReportId(reportId).ControllerName;

      switch (controllerName) {
        case 'payer-ratio':
        case 'pdpm':
        case 'clinicaldashboard':
        case 'qmreports':
        case 'mds':
        case 'adl':
        case 'infection-control':
          return 'home.detailDashboard';
        case 'rehospitalizationdashboard':
          return 'rehospdetails';
        case 'financialdashboard':
          return 'financialdetails';
        case 'resident':
          return '';
        case 'pdpm':
          return 'pdpmdetails';
        case 'healthsys':
        case 'card':
          return 'hsdetails';
        case 'reports':
        case 'infection-control-reports':
          return '';
        default:
          throw new Error(('Invalid ContollerName was specified in getDetailPage'));
      }
    } else {
      return '';
    }
  }

  gridRowClicked(event): void {
    if (
      (this.stateService.current.name === 'home.residentDashboard' && event.reportId === this.listsStateService.getReportEnumByName('Labs').Id) ||
      (this.stateService.current.name === 'home.careTransitionsDashboard' && event.reportId === this.listsStateService.getReportEnumByName('ResidentAbnormalLabs').Id)) {
      this.displayResidentLabHistory(event);
      return;
    }

    let dashboardReport = this.getDashboardReportByReportId(event.reportId);
    dashboardReport.data.options.gridOptions.selectedRow = event.index;

    if (!dashboardReport.data.drillDownGridId && !dashboardReport.data.detailDashboardId && dashboardReport.data.gridOptions.rowClickEnabled
      && event.reportId !== this.listsStateService.getReportEnumByName('IPAAlerts').Id) {
      return;
    } else {
      this.gridRowClickDrilldown(event, dashboardReport);
    }
  }

  gridRowClickDrilldown(event, dashboardReport): void {
    let details: ChartDetail = null;
    let showFooterDetails = true;
    if (event.reportId === this.listsStateService.getReportEnumByName('IPAAlerts').Id || event.reportId === this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsCurrent').Id) {
      this.category = dashboardReport.Category ? dashboardReport.Category : this.stateService.params.category;
      showFooterDetails = false;
      if(event.reportId === this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsCurrent').Id)
      {
        showFooterDetails = true;
      }
      dashboardReport.data.drillDownGridId = dashboardReport.data.drillDownGridId ? dashboardReport.data.drillDownGridId
        : dashboardReport.data.detailDashboardId;

      details = this.getIPAAlertsFilterDetails(event, dashboardReport);
    } else {
      details = this.getADLvsMDSScoreDetailFilterDetails(event);
    }

    this.reportService.getReportById(event.reportId).then((report) => {
      this.utilizationMetricsService.recordGridDrilldown(event.reportId, report.ReportName, details.filter, details.reportId);
    });
    this.filterStateService.setFilter(details.filter);
    this.selectedChartStateService.setSelectedChartDetails(details);
    if (dashboardReport.data.drillDownType === 'footerDetails') {
      this.selectedChartDetails = this.selectedChartStateService.getSelectedChartDetails(details.reportId) as ChartDetail;
      this.dashboards.forEach(dashboardControl => {
        if (dashboardReport.data.drillDownGridId) {
          if (dashboardControl.data.reportId === dashboardReport.data.drillDownGridId) {
            this.showFooterDetails = showFooterDetails;
            dashboardControl = this.buildChart(dashboardControl);
          }
        } else {
          if (dashboardControl.data.reportId !== event.reportId) {
            dashboardControl = this.buildChart(dashboardControl);
          }
        }
      });
    } else {
      this.navigateToDashboard(this.isReportDashboard ? 'home.reportDashboard' : 'home.detailDashboard',
        this.listsStateService.getDashboardById(dashboardReport.data.drillDownGridId));
    }
  }

  getIPAAlertsFilterDetails(event, dashboardReport): ChartDetail {
    const filterSettings = this.filterStateService.getFilter();
    const returnsToRoute = 'genericDashboard/' + this.dashboardId;
    filterSettings.FilterType = 'Resident';
    filterSettings.FilterValue = event.selItem.ResMRN;
    filterSettings.DetailInfo = moment(filterSettings.EndDate).format('MM/DD/YYYY');
    filterSettings.IsDrillDown = true;
    filterSettings.MDSId = event.selItem.MDSId;
    return {
      reportId: dashboardReport.data.reportId,
      chartName: dashboardReport.data.chartName,
      filter: filterSettings,
      returnsToRoute: returnsToRoute,
      selectedGridRow: event.index,
      sortableGridColumn: event.sortType,
      sortableGridColumnReverse: event.sortReverse
    };
  }

  getADLvsMDSScoreDetailFilterDetails(event): ChartDetail {
    const filterSettings = this.filterStateService.getFilter();
    this.endDateOfParentGrid = filterSettings.EndDate;
    filterSettings.EndDate = moment(event.selItem.ADLdt);
    filterSettings.FilterType = 'Resident';
    filterSettings.FilterValue = event.selItem.ResMRN;
    filterSettings.DetailInfo = moment(filterSettings.EndDate).format('MM/DD/YYYY');
    filterSettings.IsDrillDown = true;

    const adlVsMDSScoreDetailEnum = this.listsStateService.getReportEnumByName('ADLvsMDSScoreDetail');
    return {
      reportId: adlVsMDSScoreDetailEnum.Id,
      chartName: adlVsMDSScoreDetailEnum.Name,
      filter: filterSettings,
      sortableGridColumn: event.sortType,
      sortableGridColumnReverse: event.sortReverse
    };
  }

  displayResidentLabHistory(event) {
    const filterSettings = this.filterStateService.getFilter();
    filterSettings.filterType = 'TestName';
    filterSettings.filterValue = event.selItem.LabTestName;
    this.residentLabResultsComponent.showLabHistory(filterSettings);
  }

  getGridClass(cardType, gridClass, isFooterGrid, reportId): string {
    const gridCls = cardType === 'ipaAlert' || cardType === 'grid' || cardType === 'mdsDashDetail' || cardType === 'pdpmWorksheet' ?
      (gridClass ? gridClass : ('fixed-height-report fh-double-tables fh-short-title '
        + (isFooterGrid ? '' : ' financedetail_bottomMargin ')
        + (this.showFooterDetails ? ' financialdetail_table_short' : ' financialdetail_table')))
      : 'full-height';

    return gridCls;
  }

  convertSnakeCaseToCamelCase(input: string): string {
    return input.replace(/([-_][a-z])/ig, (str) => {
      return str.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  resetCardDetails() {
    this.drillDownStateService.clearDrillDownHistory();
    this.setAllFacilitiesMode(true, true);
    this.reloadDashboard();
  }

  setAllFacilitiesMode(isAllFacilities, swapChartCategory) {
    if (swapChartCategory && this.selectedChartDetails.series) {
      this.selectedChartDetails.category = this.selectedChartDetails.series;
      this.selectedChartDetails.filter.FilterValue = this.selectedChartDetails.series;
    }
    this.allFacsSelectedForDrilldown = isAllFacilities;
    this.showResetDetailsIcon = !isAllFacilities;
    if (this.selectedChartDetails) {
      this.selectedChartDetails.blockSelectedPointColor = isAllFacilities;
    }
  }

  cardFlipped(event) {
    this.dashboards.forEach(dashboardControl => {
      if (dashboardControl.data.flipChartShow !== undefined) {
        dashboardControl.data.flipChartShow = !dashboardControl.data.flipChartShow;
        if (dashboardControl.data.flipChartShow) {
          this.utilizationMetricsService.recordUserCardFlip(dashboardControl.data.reportId);
        }
      }
    });
  }

  handleReportEvents(report) {
    const filterSett = report.Filter;
    if (filterSett.QMTypeIDs) {
      const filterSettings = this.filterStateService.getFilter();
      filterSett.QMTypeIDs = filterSettings.QMTypeIDs;
    }
    filterSett.DashboardId = this.dashboardId;
    this.filterStateService.setFilter(filterSett);
    this.filterDashboardService.setFilterSettings(filterSett);
    if (report.ReportId === this.listsStateService.getReportEnumByName('ResidentShortStayQMs').Id ||
      report.ReportId === this.listsStateService.getReportEnumByName('ResidentLongStayQMs').Id) {
      const currentReport = this.selectedChartStateService.getSelectedReport();
      report.ChartName = currentReport.chartName;
      report.ReportId = currentReport.reportId;
    }

    this.selectedChartStateService.setSelectedChartDetails({
      reportId: Number(report.ReportId),
      chartName: report.ChartName,
      filter: filterSett
    } as ChartDetail);
  }

  gridCellDrillDown(event) {
    let dashboardReport = this.getDashboardReportByReportId(event.reportId);
    let filterSettings = this.filterStateService.getFilter();
    filterSettings.Denominator = event.denominator;

    if (event.column.ReportColumnDefinitionProps && event.column.ReportColumnDefinitionProps.CellClickHandler) {
      this.cellClickComponent[event.column.ReportColumnDefinitionProps.CellClickHandler](event, dashboardReport, filterSettings);
      return;
    }
  }

  setResidentCARDScorePopup(event: any) {
    if (event.point.options.y > 0) {
      let filterSettings: FilterSettings;
      filterSettings = {
        OrganizationId: Number(this.filtersService.filterSettings.get().OrganizationId),
        ResMrn: this.filtersService.filterSettings.get().ResMRN,
        AsOfDate: event.filter.FilterValue,
        UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
      };
      this.rehospDashboardService.getResidentScore(filterSettings).subscribe(data => {
        this._residentScoreDetail = data;
        this.residentCardScoreDetailComponent.showModalDetail(this._residentScoreDetail, getRiskColor(data.RiskLevel));
      });
    }
  }

  getFilterSettings(dashboardControl): FilterSettings {
    switch (dashboardControl.ControllerName) {
      case 'qmreports':
        return this.getQMReportsFilter(dashboardControl);
        break;
      case 'clinicaldashboard':
        return this.getClinicalDashboardReportsFilter(dashboardControl);
        break;
      case 'rehospitalizationdashboard':
        return this.getRehospitalizationDashboardReportsFilter(dashboardControl);
        break;
      case 'financialdashboard':
      case 'resident':
      case 'payer-ratio':
      case 'pdpm':
      case 'mds':
      case 'adl':
        return this.getReportsFilter(dashboardControl);
        break;
      case 'healthsys':
      case 'card':
        return this.getHSDashboardReportsFilter(dashboardControl);
        break;
      case 'reports':
        return this.getAdminReportsFilter(dashboardControl);
        break;
      case 'infection-control':
      case 'infection-control-reports':
        return this.getInfectionControlDashboardReportsFilter(dashboardControl);
        break;
      default:
        throw new Error(('Invalid ContollerName was specified : ' + dashboardControl.ControllerName));
    }
  }

  getQMReportsFilter(dashboardControl): FilterSettings {
    const filterSettingsDto = this.genericDashboardFilterService.getQMReportsFilter(dashboardControl, this.selectedChartDetails,
      this.isDetailDashboard, this.isReportDashboard);

    if (filterSettingsDto.QMTypes) {
      this.genericDashboardVM.filterQMTypes = filterSettingsDto.QMTypes;
    }
    this.detailInfo = filterSettingsDto.DetailInfo;
    return filterSettingsDto.FilterSettings;
  }

  getClinicalDashboardReportsFilter(dashboardControl): FilterSettings {
    const filterSettingsDto = this.genericDashboardFilterService.getClinicalDashboardReportsFilter(dashboardControl,
      this.selectedChartDetails, this.isDetailDashboard, this.isReportDashboard);
    this.detailInfo = filterSettingsDto.DetailInfo;
    return filterSettingsDto.FilterSettings;
  }

  getRehospitalizationDashboardReportsFilter(dashboardControl): FilterSettings {
    const filterSettingsDto = this.genericDashboardFilterService.getRehospitalizationDashboardReportsFilter(dashboardControl,
      this.selectedChartDetails, this.isDetailDashboard, this.isReportDashboard);
    this.detailInfo = filterSettingsDto.DetailInfo;
    this.selectedChartDetails = filterSettingsDto.SelectedChartDetails;
    return filterSettingsDto.FilterSettings;
  }

  getInfectionControlDashboardReportsFilter(dashboardControl): FilterSettings {
    const filterSettingsDto = this.getReportsFilter(dashboardControl);
    filterSettingsDto.DataFilters = this.genericDashboardFilterService.getInfectionControlDetailDashboardReportsDataFilters(
      dashboardControl, this.selectedChartDetails, this.isDetailDashboard, this.isReportDashboard);
    this.detailInfo = filterSettingsDto.DetailInfo;
    return filterSettingsDto;
  }

  getReportsFilter(dashboardControl): FilterSettings {
    const filterSettingsDto = this.genericDashboardFilterService.getReportsFilter(dashboardControl, this.selectedChartDetails,
      this.isDetailDashboard, this.isReportDashboard, this.allFacsSelectedForDrilldown);
    filterSettingsDto.FilterSettings.IsCareTransitions = this.isCareTransitions;
    this.selectedChartDetails = filterSettingsDto.SelectedChartDetails;
    this.detailInfo = filterSettingsDto.DetailInfo;
    return filterSettingsDto.FilterSettings;
  }

  getHSDashboardReportsFilter(dashboardControl): FilterSettings {
    const filterSettingsDto = this.genericDashboardFilterService.getHSDashboardReportsFilter(dashboardControl,
      this.selectedChartDetails, this.isDetailDashboard, this.isReportDashboard, this.allFacsSelectedForDrilldown);
    this.detailInfo = filterSettingsDto.DetailInfo;
    return filterSettingsDto.FilterSettings;
  }

  getAdminReportsFilter(dashboardControl): FilterSettings {
    const filterSettingsDto = this.genericDashboardFilterService.getAdminReportsFilter(dashboardControl);
    this.detailInfo = filterSettingsDto.DetailInfo;
    return filterSettingsDto.FilterSettings;
  }

  setFilterComponentInputs(reportId?) {
    if (this.isReportDashboard) {
      if (reportId === this.listsStateService.getReportEnumByName('PDPMSummaryDetail').Id
        || reportId === this.listsStateService.getReportEnumByName('FacilityBedCapacity').Id) {
        this.IsShowFilter = false;
        this.hideFilterButton = true;
      } else if (reportId === this.listsStateService.getReportEnumByName('QMDetail').Id
        || reportId === this.listsStateService.getReportEnumByName('QMSummaryDetail').Id) {
        this.hideFilterButton = true;
        this.IsShowFilter = false;
        this.hideFacilityDropdown = true;
      }
    } else if (this.isAdminReports) {
      if (this.stateService.current.name === 'home.facilityPortalUsageReport') {
        this.IsShowFilter = false;
        this.isFacPortalUsage = true;
      } else if (this.stateService.current.name === 'home.keywordReport') {
        this.IsShowFilter = false;
        this.isKeywordAdminReport = true;
      }
    }
  }

  getDashboardReportByReportId(reportId): any {
    let dashboardReport;
    this.dashboards.forEach(dr => {
      if (dr.ReportId === reportId) {
        dashboardReport = dr;
      }
    });
    return dashboardReport;
  }

  navigateToDashboard(route, dashboard): void {
    this.stateService.go(route, {
      dashboardName: dashboard.DashboardRoute,
      category: dashboard.Category ? dashboard.Category : ''
    });
  }
}
