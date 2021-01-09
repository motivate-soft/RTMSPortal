import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '@uirouter/core';
import { RtmsConstantService } from '../../services/rtms-constant.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { UserSettingService } from '../../services/portal/userSetting.service';
import { ExportService, ReportService } from '../../services/services-index';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { FilterStateService } from '../../services/filter-state.service';
import { ReportModel } from '../../models/report.model';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';
import { OrganizationModel } from '../../models/models-index';
import { FilterDashboardService } from 'src/app/shared/services/portal/filter-dashboard.service';
import { DrillDownStateService } from 'src/app/drill-down/store/services/drill-down-state.service';
import { list } from '../../utility/list';
import { BaseComponent } from '../base.component';
import { ChartDetail } from '../../models/chart-details';

@Component({
  selector: 'rtms-reports-header',
  templateUrl: './reports-header.component.html',
  styleUrls: ['./reports-header.component.scss']
})
export class ReportsHeaderComponent extends BaseComponent implements OnInit {

  @Input() reportTitle: string;
  @Input() reportsVm: any;
  @Input() showPayers: boolean;
  @Input() showQms: boolean;
  @Input() showCategories: boolean;
  @Input() showTypes: boolean;
  @Input() showUnits: boolean;
  @Input() currentDisplayReport: string;
  @Input() showBackToButton: boolean;
  @Input() backButtonText: string;
  @Input() backButtonShortText: string;
  @Input() backButtonHref: string;
  @Input() showFilter: boolean;
  @Input() hideFacilityName: boolean;
  @Input() allowChangeOrg: boolean;
  @Input() reportId: number;
  @Input() showDischargeOnly: boolean;
  @Input() displayMode: string;
  @Input() isHS: boolean;
  @Input() show: boolean;
  @Input() showMenu: boolean;
  @Input() dashboardId: number;

  public drillDownHistory: ChartDetail[] = [];
  public isResidentDashboard: boolean;
  public isCareTransitionsDashboard: boolean;
  public isProactHsDashboard: boolean;
  public userSettingConstants = this.rtmsConstantService.settings;
  public backButtonIconClass: string;
  public userMultipleOrganizations: OrganizationModel[];
  public selectedEnterpriseOrg: OrganizationModel;
  public isChangingOrg: false;

  constructor(private stateService: StateService,
    private rtmsConstantService: RtmsConstantService,
    private userStateService: UserStateService,
    private userSettingService: UserSettingService,
    private exportService: ExportService,
    private listsStateService: ListsStateService,
    private reportService: ReportService,
    private filtersService: FiltersService,
    private filterStateService: FilterStateService,
    private utilizationMetricsService: UtilizationMetricsService,
    private filterDashboardService: FilterDashboardService,
    private drillDownStateService: DrillDownStateService) {
    super();
    if (this.stateService.params.isReportDashboard) {
      this.subscriptions.push(this.drillDownStateService.getDrillDownHistoryStream().subscribe(data => {
        this.drillDownHistory = list(data).ToArray();
      }));
    }

    this.subscriptions.push(this.listsStateService.getUseOrganizationsStream()
      .subscribe(organizations => {
        this.initializeOrganizationDdl();
      }));
  }

  ngOnInit() {

    this.isHS = (this.stateService.current.name === 'home.hs' || this.stateService.params.category === 'hs'
      || this.stateService.params.category === 'reports-hs');
    this.displayMode = (this.stateService.current.name === 'home.hs' || this.stateService.params.category === 'reports-hs') ? 'hs' : this.displayMode;
    this.displayMode = this.isEnterprise() ? 'enterprise' : this.displayMode;
    this.allowChangeOrg = (this.allowChangeOrg === undefined) ? true : this.allowChangeOrg;
    this.isCareTransitionsDashboard = this.stateService.current.name === 'home.careTransitionsDashboard';
    this.isResidentDashboard = this.stateService.current.name === 'home.residentDashboard';
    this.isProactHsDashboard = this.stateService.current.name === 'home.hs';
    this.initializeOrganizationDdl();
    this.selectedEnterpriseOrg = this.filterDashboardService.getEnterpriseFromFilterOrDefault();

    // If filtersettings is true, trigger "Filter" button click to open filter by default
    if (!this.reportsVm.showMenu && this.showFilter &&
      this.userStateService.getSettings()[this.userSettingConstants.FilterOpened].value === true) {
      // To avoid Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
      setTimeout(() => {
        this.reportsVm.showFilter(true);
      });
    }

    this.backButtonIconClass = this.backButtonText === 'Back to Dashboard' ? 'fa-pie-chart' : 'fa-files-o';
  }

  initializeOrganizationDdl() {
    this.userMultipleOrganizations = this.listsStateService.getOrganizationsForDropDown();
  }  

  goBack(location: string): void {
    if (location === this.stateService.current.name) {
      this.stateService.transitionTo('home.reportsLanding');
    } else {
      if (location === 'home.financial') {
        if (this.userStateService.getLoggedInUser().IsCorporateUser) {
          this.stateService.transitionTo('corporate');
        } else {
          this.stateService.transitionTo('home.financial');
        }
      } else if (location === 'home.clinical') {
        this.stateService.transitionTo('home.clinical');
      } else if (location.indexOf('genericDashboard') >= 0) {
        const db = location.split('/');
        if (db && db[1] === '7') {
          this.stateService.transitionTo('home.hospitalDashboard', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '1') {
          this.stateService.transitionTo('home.financial', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '2') {
          this.stateService.transitionTo('home.clinical', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '3') {
          this.stateService.transitionTo('home.rehospitalization', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '4') {
          this.stateService.transitionTo('home.hs', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '9') {
          this.stateService.transitionTo('home.pdpm', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '600') {
          this.stateService.transitionTo('home.enterpriseProactDashboard', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '700') {
          this.stateService.transitionTo('home.enterpriseFinancialDashboard', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '900') {
          this.stateService.transitionTo('home.enterpriseClinicalDashboard', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '1000') {
          this.stateService.transitionTo('home.enterprisePDPMDashboard', { 'dashboardId': Number(db[1]) });
        } else if (db && db[1] === '1100') {
          this.stateService.transitionTo('home.infectionControl', { 'dashboardId': Number(db[1]) });
        } else {
          this.stateService.transitionTo('home.genericDashboard', { 'dashboardId': Number(db[1]) });
        }
      } else {
        this.stateService.transitionTo(location);
      }
    }
  }

  hasValue(val): boolean {
    return val !== null && val !== '' && val !== undefined;
  }

  showFilterClicked(value: boolean): void {
    this.reportsVm.showFilter(value);
    const filterSetting = this.userStateService.getSettings()[this.userSettingConstants.FilterOpened].value;
    // Set filter to false, only if value=true, which means, allow hiding filter
    const isFilterShown = !filterSetting || !value;

    this.setFilterSetting(isFilterShown);
  }

  setFilterSetting(filter: boolean): void {
    this.userSettingService.setUserSetting(this.userSettingConstants.FilterOpened, filter);
  }

  exportAll(): void {
    if (this.isCareTransitionsDashboard) {
      this.reportId = this.listsStateService.getReportEnumByName('CareTransitionsDashboardExport').Id;
    } else {
      this.reportId = this.listsStateService.getReportEnumByName('ResidentDashboardExport').Id;
    }
    this.reportService.getReportById(this.reportId).then((response) => {
      this.export(response);
    });
  }

  export(report: ReportModel): void {
    const type = 'pdf';
    const filter = this.filterStateService.getFilter();
    this.utilizationMetricsService.recordExports(report.ReportId, report.ReportName, type, filter);
    const org = this.filtersService.organizations.getFirstOrDefault();

    this.exportService.downloadReport(report, type, null, filter, org);
  }

  getSelectedOrgName(): String {
    let displayedOrgName = '';

    if (this.isHS) {
      displayedOrgName = this.filterDashboardService.getHSFromFilterOrDefault().OrganizationName;
    } else if (this.isEnterprise()) {
      displayedOrgName = this.filterDashboardService.getEnterpriseFromFilterOrDefault().OrganizationName;
    } else {
      displayedOrgName = this.filterDashboardService.getSelectedOrganization().OrganizationName;
    }

    return displayedOrgName;
  }

  public changeSelectedEnterpriseOrg(): void {
    this.filtersService.selectedEnterpriseOrganization.set(this.selectedEnterpriseOrg);
  }

  isEnterprise(): boolean {
    return (this.stateService.current.name === 'home.enterpriseProactDashboard' ||
      this.stateService.current.name === 'home.enterpriseFinancialDashboard' ||
      this.stateService.current.name === 'home.enterpriseClinicalDashboard' ||
      this.stateService.current.name === 'home.enterprisePDPMDashboard' ||
      this.stateService.params.category.includes('enterprise'));
  }

}
