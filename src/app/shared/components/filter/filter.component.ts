import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterDashboardService } from '../../services/portal/filter-dashboard.service';
import { QmReportService } from '../../services/portal/qmReport.service';
import { LookUpDataService } from '../../services/portal/lookUpData.service';
import { NavigationService } from '../../services/portal/navigation.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';
import { DisplayFormats } from '../../services/rtms-constant.service';
import { FilterSettings } from '../../models/filter-settings';
import { StateService } from '@uirouter/core';
import { FacilityUnit } from '../../models/facility-unit';
import { Payer } from '../../models/payer';
import { Subscription } from 'rxjs';
import { QMType } from '../../models/qm-type';
import { OrganizationModel } from '../../models/models-index';
import { SelectOption } from '../../models/select-option';
import { Category } from '../../models/category';
import { UINotifierService } from '../../services/services-index';
import { UIEventTypes } from '../../enums/ui-event-types';
import { filter } from 'rxjs/operators';
import { list } from '../../utility/list';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { Filters } from '../../enums/filters';
import { BaseComponent } from '../base.component';
import { ReportInfo } from '../../models/report-info';
import { SelectedChartStateService } from '../../services/selected-chart-state.service';
import { FeatureService } from '../../services/feature.service';

@Component({
    selector: 'rtms-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})

export class FilterComponent extends BaseComponent implements OnInit {

    constructor(
        private stateService: StateService,
        private filterDashboardService: FilterDashboardService,
        private qmReportService: QmReportService,
        private lookDataService: LookUpDataService,
        private navigationService: NavigationService,
        public filterService: FiltersService,
        private listSateService: ListsStateService,
        private userStateService: UserStateService,
        public toasterService: ToastrService,
        private utilizationMetricsService: UtilizationMetricsService,
        public uiNotifierService: UINotifierService,
        private selectedChartStateService: SelectedChartStateService,
        private featureService: FeatureService,
        private listsStateService: ListsStateService
    ) {
        super();
        this.setSelectedOrganization();
        this.subscribeFilterState();

    }
    selStay: SelectOption = null;
    selCategories: Category[] = [];
    isKeywordSearch = false;
    isUtilizationScore = false;
    isEnterpriseProactDashboard = false;
    isEnterpriseFinancialDashboard = false;
    isEnterpriseClinicalDashboard = false;
    isEnterprisePDPMDashboard = false;
    isTwentyFourHour = false;
    previousOrg: OrganizationModel = null;
    filterSettings: FilterSettings = null;
    filterDate: Date = null;
    startDate: Date = null;
    endDate: Date = null;
    qmTypes: QMType[] = [];
    isQM = false;
    isQMCount = false;
    isQMSummary = false;
    isClinicalDashboard = false;
    isPortalUsage = false;
    isInfectionSurveillance = false;
    useSingleDate = this.filterDashboardService.useSingleDate(this.stateService.current.name);
    isResidentDashboard = false;
    selectedOrganization: OrganizationModel = null;
    isHealthSystem = this.isHealthSystemFun();
    showFilterUnits = true;
    facility = this.getFacilitiesForDropdown(this.stateService.current.name);
    enableTime = true;
    dateFormat = DisplayFormats.date;
    selUnit: FacilityUnit[] = [];
    selMultiFacs: OrganizationModel[] = [];
    selPayer: Payer[] = [];
    selUserStatus: SelectOption[] = [];
    selQMType: QMType[] = [];
    selType: SelectOption[] = [];
    chkOnlyDischarged = false;
    userStatus = this.listSateService.getUserStatus();
    stay = this.listSateService.getStay();
    type = this.listSateService.getTypes();
    units: FacilityUnit[] = [];
    payers: Payer[] = [];
    isMultiFacilityUnit = false;
    categories: Category[] = [];
    @Output() reload = new EventEmitter();

    ngOnInit() {
        this.findDataOnState();
    }

    findDataOnState() {
        this.facilityWiseUnitAndPayerSelected();
        const selectedReport = this.selectedChartStateService.getSelectedReport();
        const reportId = selectedReport ? selectedReport.reportId : null;
        this.filterService.isQMAverageDrillDown.set(false);
        if (this.stateService.params.category === 'reports-qm') {
            if (reportId === this.listSateService.getReportEnumByName('QMAverageCompare').Id) {
                this.isQM = true;
                this.filterService.isQMAverageDrillDown.set(true);
            } else if (reportId === this.listSateService.getReportEnumByName('QMCounts').Id
                || reportId ===
                this.listSateService.getReportEnumByName('QMSummaryDetail').Id) {
                this.isQMCount = true;
                this.filterService.isQMAverageDrillDown.set(false);
            } else if (reportId === this.listSateService
                .getReportEnumByName('QMSummary').Id ||
                reportId === this.listSateService.getReportEnumByName('QMDetail').Id) {
                this.isQMSummary = true;
                if (reportId === this.listSateService.getReportEnumByName('QMSummary').Id) {
                    this.filterService.isQMAverageDrillDown.set(false);
                }
            } else {
                this.isQM = false;
                this.isQMSummary = false;
                this.isQMCount = false;
                this.filterService.isQMAverageDrillDown.set(false);
            }
        } else if (this.stateService.params.category === 'reports-infection-control') {
            if (reportId === this.listSateService.getReportEnumByName('InfectionSurveillance').Id) {
              this.isInfectionSurveillance = true;
              this.OrgnizationsAndStatusSelected();
            }
        } else if (this.stateService.params.category === 'reports-clinical') {
            this.filterService.isQMAverageDrillDown.set(false);
            if (reportId
                === this.listSateService.getReportEnumByName('TwentyFourHourReport').Id) {
                this.isTwentyFourHour = true;
            } else if (reportId
                === this.listSateService.getReportEnumByName('KeywordSearch').Id
                || reportId
                === this.listSateService.getReportEnumByName('KeywordCMISearch').Id) {
                this.isKeywordSearch = true;
            } else {
                this.isTwentyFourHour = false;
                this.isKeywordSearch = false;
            }
        } else if (this.stateService.current.name === 'clinical' || this.stateService.current.name === 'dashboard') {
            this.isClinicalDashboard = true;
            this.filterService.isQMAverageDrillDown.set(false);
        } else if (this.stateService.current.name === 'home.utilizationScoreCard') {
            this.isUtilizationScore = true;
        } else if (this.stateService.current.name === 'home.enterpriseProactDashboard') {
            this.isEnterpriseProactDashboard = true;
        } else if (this.stateService.current.name === 'home.portalUsageReport') {
            this.isPortalUsage = true;
            this.OrgnizationsAndStatusSelected();
        } else if (this.stateService.current.name === 'home.residentDashboard' || this.stateService.current.name === 'home.careTransitionsDashboard') {
            this.isResidentDashboard = true;
        } else if (this.stateService.current.name === 'home.enterpriseFinancialDashboard') {
            this.isEnterpriseFinancialDashboard = true;
        } else if (this.stateService.current.name === 'home.enterpriseClinicalDashboard') {
            this.isEnterpriseClinicalDashboard = true;
        } else if (this.stateService.current.name === 'home.enterprisePDPMDashboard') {
            this.isEnterprisePDPMDashboard = true;
        } else {
            this.filterService.isQMAverageDrillDown.set(false);
        }
        this.setCategoriesData(this.selectedOrganization.OrganizationId);
        if (this.isKeywordSearch) {
            this.setTypesData();
            this.setCheckOnlyDischarge();

        }
        
        if (this.isQM || this.isQMCount || this.isQMSummary) {
            this.setQMTypeData();
        }
        this.setUnitPayers();
        this.getInitialDates(this.isQM, this.isQMCount, this.isQMSummary);
    }

    applyFilter() {
        const selectedReport = this.selectedChartStateService.getSelectedReport();
        const reportId = selectedReport ? selectedReport.reportId : this.filterService.filterSettings.get().Reportid;
        this.filterSettings = {
            StartDate: this.useSingleDate ? this.filterDate : this.startDate,
            EndDate: this.useSingleDate ? this.filterDate : this.endDate
        };

        this.lookDataService.validateDate(this.useSingleDate, this.filterSettings.StartDate,
            this.filterSettings.EndDate, reportId).subscribe((response) => {
                if (response.Message !== '') {
                    this.toasterService.error('Invalid date in filter', response.Message);
                    return;
                } else {
                    this.filterSettings.UserTimeZoneId = this.userStateService.getLoggedInUser().TimeZoneId;
                    this.filterSettings.Units = this.getUnitIdCSV(this.selUnit);
                    this.filterSettings.Payers = this.getPayerIdCSV(this.selPayer);
                    this.filterSettings.QMTypeIDs = this.getQmTypeIdCSV(this.selQMType);
                    this.filterSettings.Type = this.getTypeIdCSV(this.selType);
                    this.filterSettings.Categories = this.getCategoryIdCSV(this.selCategories);

                    this.filterService.isDefault.set(false);
                    this.filterSettings.OrganizationId = this.selectedOrganization.OrganizationId;
                    this.previousOrg = this.getSelectedOrganizationForFilter();
                    this.filterService.isFilterApplied.set(true);

                    if (this.isPortalUsage || this.isInfectionSurveillance) {
                        if (this.selMultiFacs.length === 0) {
                            this.filterService.organizations.set(this.listSateService.getUserFacilities(true)).subscribe(orgs => {
                                this.applyFilterOnData(this.filterService.organizations.getFirstOrDefault());
                            });
                        } else {
                            this.filterService.organizations.set(this.selMultiFacs).subscribe(orgs => {
                                this.applyFilterOnData(this.filterService.organizations.getFirstOrDefault());
                            });
                        }
                    } else if (this.isEnterpriseDashboard()) {
                        this.filterService.selectedEnterpriseOrganization.set(this.selectedOrganization).subscribe(orgs => {
                            this.applyFilterOnData(this.filterService.selectedEnterpriseOrganization.get());
                        });

                    } else {
                        this.filterService.organizations.set([this.selectedOrganization]).subscribe(orgs => {
                            this.applyFilterOnData(this.filterService.organizations.getFirstOrDefault());
                        });
                    }
                    this.filterService.filterSettings.set(this.filterSettings);
                }
            });
    }
    private applyFilterOnData(currentOrganization: OrganizationModel) {
        if (this.previousOrg) {
            if (this.stateService.current.data.requiresFeatures && this.stateService.current.data.requiresFeatures.length > 0) {
                if (!this.featureService.isRequiredFeaturesEnabledForFacility([currentOrganization], this.stateService.current.data.requiresFeatures)) {
                    // get out of here!!!
                    this.navigationService.navigateToDashboard(currentOrganization);
                    return;
                }
            } else {
                if (this.previousOrg.LandingPageRoute !== null && currentOrganization.LandingPageRoute !== this.previousOrg.LandingPageRoute) {
                    // get out of here!!!
                    this.navigationService.navigateToDashboard(currentOrganization);
                    return;
                }
            }
            if (this.isQM) {
                this.filterSettings.DayRange = 7;
                this.filterSettings.QMTypeIDs = this.getQmTypeIdCSV(this.selQMType);
                this.filterSettings.ShortStay =
                    this.selStay !== null && this.selStay.id === 1 ? true : false;

                this.filterDashboardService.setFilterSettings(this.filterSettings, true, false);
                this.reload.emit();

            } else if (this.isQMCount || this.isQMSummary) {
                this.filterSettings.DayRange = 7;
                this.filterSettings.QMTypeIDs =
                    ((this.selQMType && this.selQMType.length > 0)
                        ? this.getQmTypeIdCSV(this.selQMType)
                        : (this.filterDashboardService.getFilterSettings().QMTypeIDs
                            ? this.filterDashboardService.getFilterSettings().QMTypeIDs
                            : null));

                if (this.filterService.isQMAverageDrillDown.get()) {
                    this.filterSettings.ShortStay =
                        this.selStay !== null && this.selStay.id === 1 ? true : false;
                }

                if (this.isQMSummary) {
                    this.filterDashboardService.setFilterSettings(this.filterSettings,
                        false,
                        false,
                        true);
                } else {
                    this.filterDashboardService.setFilterSettings(this.filterSettings,
                        false,
                        true,
                        false);
                }
                this.reload.emit();


            } else if (this.isTwentyFourHour) {
                this.filterSettings.Categories = this.getCategoryIdCSV(this.selCategories);
                this.filterDashboardService.setFilterSettings(this.filterSettings);
                this.reload.emit();

            } else if (this.isKeywordSearch) {
                this.filterSettings.Type = this.getTypeIdCSV(this.selType);
                this.filterSettings.OnlyDischargedResidents = this.chkOnlyDischarged;
                this.filterDashboardService.setFilterSettings(this.filterSettings);
                this.reload.emit();

            } else if (this.isPortalUsage || this.isInfectionSurveillance) {
                this.filterSettings.Facilities = this.filterService.organizations.get();
                this.filterSettings.UserStatuses = this.selUserStatus;
                this.filterDashboardService.setFilterSettings(this.filterSettings);
                this.reload.emit();

            } else {

                if (!this.enableTime) {
                    this.filterSettings.StartDate =
                        moment(this.filterSettings.StartDate).startOf('day').toDate();
                    this.filterSettings.EndDate =
                        moment(this.filterSettings.EndDate).startOf('day').toDate();
                }

                this.filterDashboardService.setFilterSettings(this.filterSettings);

                this.reload.emit();
            }
            const loadFilterSettings = this.filterDashboardService
                .getFilterSettings(this.isQM, false, this.isQMCount, this.isTwentyFourHour,
                    this.isKeywordSearch, this.isQMSummary, this.isResidentDashboard);
            this.utilizationMetricsService.recordFilter();
        }
    }
    subscribeFilterState() {

        this.subscriptions.push(this.uiNotifierService.getUIEvents().
            pipe(filter(notificationEvent =>
                notificationEvent && notificationEvent.type === UIEventTypes.FilterUpdate))
            .subscribe(event => {
                if (event) {
                    this.startDate = new Date(this.filterDashboardService
                        .getFilterSettings(this.isQM, false, this.isQMCount,
                            this.isTwentyFourHour, this.isKeywordSearch, this.isQMSummary, this.isResidentDashboard).StartDate);
                    this.endDate = new Date(this.filterDashboardService.getFilterSettings(this.isQM, false, this.isQMCount,
                        this.isTwentyFourHour, this.isKeywordSearch, this.isQMSummary, this.isResidentDashboard).EndDate);
                    this.filterDate = new Date(this.filterDashboardService.
                        getFilterSettings(this.isQM, false, this.isQMCount,
                            this.isTwentyFourHour, this.isKeywordSearch, this.isQMSummary, this.isResidentDashboard).EndDate);
                    this.setUnitPayers();
                }

            }));
        this.subscriptions.push(this.uiNotifierService.getUIEvents().
            pipe(filter(notificationEvent =>
                notificationEvent && notificationEvent.type === UIEventTypes.ClearFilters))
            .subscribe((event: PortalUIEvent) => {
                if (event) {
                    switch (event.value.type) {
                        case Filters.Units:
                            this.selUnit = [];
                            break;
                        case Filters.Payers:
                            this.selPayer = [];
                            break;
                        case Filters.Categories:
                            this.selCategories = [];
                            break;
                        case Filters.Types:
                            this.selType = [];
                            break;
                        case Filters.QmTypes:
                            this.selQMType = [];
                            break;
                        case Filters.OnlyDischargedResidents:
                            this.chkOnlyDischarged = false;
                            break;
                    }
                    this.logRemoveFilterSettings();
                }
            }));

        this.subscriptions.push(this.uiNotifierService.getUIEvents().
            pipe(filter(notificationEvent =>
                notificationEvent && notificationEvent.type === UIEventTypes.ChangeFacility))
            .subscribe(event => {
                if (event) {
                    this.facilityChangeEvent(event.value);
                }
            })
        );

        this.subscriptions.push(this.listsStateService.getUseOrganizationsStream()
            .subscribe(organizations => {
                this.facility = this.getFacilitiesForDropdown(this.stateService.current.name)
            }));
    }

    changeFacility() {
        const filterSettings = this.filterService.filterSettings.get();
        filterSettings.Units = null;
        filterSettings.Payers = null;
        this.filterService.filterSettings.set(filterSettings);

        this.selUnit = [];
        this.selPayer = [];

        this.facilityWiseUnitAndPayerSelected();

    }

    facilityWiseUnitAndPayerSelected() {
        const selectedFacId = this.selectedOrganization.OrganizationId;
        this.setUnitData(selectedFacId);
        this.setPayerData(selectedFacId);
        this.setCategoriesData(selectedFacId);
    }

    logRemoveFilterSettings() {
        const filterSettings =
            this.filterDashboardService
                .getFilterSettings(this.isQM, false, this.isQMCount, this.isTwentyFourHour, this.isKeywordSearch, this.isQMSummary);
        this.utilizationMetricsService.recordFilter();
    }

    facilityChangeEvent(org: OrganizationModel) {

        this.selectedOrganization = org;
        if (!this.isHealthSystem && !this.isUtilizationScore) {
            this.changeFacility();
        }
        this.applyFilter();
    }

    setUnitPayers() {

        if (this.isQM) {
            this.qmTypes = this.listSateService.getQMs();
            this.selStay = this.selStay ? this.selStay : this.listSateService.getStay()[0];
        }

        if (this.isQMCount || this.isQMSummary) {
            this.qmTypes = this.listSateService.getQMs();
        }

        if (this.filterService.isQMAverageDrillDown.get()) {
            const selectedStay = this.filterDashboardService.getFilterSettings(true).ShortStay;
            this.selStay = selectedStay ? this.listSateService.getStay()[0] : this.listSateService.getStay()[1];
        }
        this.qmTypes = this.listSateService.getQMs();
    }

    getFacilitiesForDropdown(route) {
        switch (route) {
            case 'home.hs': {
                    return this.filterDashboardService.getUserFacilitiesWithFeatureEnabled('HealthSystem');
                }
            case 'home.utilizationScoreCard': {
                    return this.listSateService.getUserOrganizations();
                }
            default:
                return this.listSateService.getUserFacilities();
        }
    }

    getInitialDates(isQM, isQMCount, isQMSummary) {

        const initFilterSettings =
            this.filterDashboardService.getFilterSettings(isQM, false, isQMCount, this.isTwentyFourHour, this.isKeywordSearch,
                isQMSummary, this.isResidentDashboard);
        this.filterDate = new Date(moment(initFilterSettings.EndDate).toDate());
        this.endDate = new Date(moment(initFilterSettings.EndDate).toDate());
        this.startDate = new Date(moment(initFilterSettings.StartDate).toDate());

        if (!this.enableTime) {
            this.startDate = moment(this.startDate).startOf('day').toDate();
            this.endDate = moment(this.endDate).startOf('day').toDate();
        }
    }

    isHealthSystemFun() {
        return (this.stateService.current.name === 'home.hs' || this.stateService.params.category === 'hs');
    }

    isEnterpriseDashboard() {
        return (this.stateService.current.name === 'home.enterpriseProactDashboard' ||
            this.stateService.current.name === 'home.enterpriseFinancialDashboard' ||
            this.stateService.current.name === 'home.enterpriseClinicalDashboard' ||
            this.stateService.current.name === 'home.enterprisePDPMDashboard');
    }

    setUnitData(facilityId) {
        this.isMultiFacilityUnit = this.isEnterpriseDashboard();
        this.lookDataService.getUnits(facilityId).subscribe((response) => {
            this.units = response;
            this.listSateService.setUnits(this.units);
            this.setSelectedUnitsForDashboard(this.units);
        });
    }

    setSelectedUnitsForDashboard(units: FacilityUnit[]) {
        let filteredUnits = this.filterService.filterSettings.get().Units;
        if (filteredUnits) {
            filteredUnits = list(filteredUnits.split(',').map(Number));
            this.selUnit = list(units).Where(a => filteredUnits.Any(t => t === a.FacilityUnitId)).ToArray();
        } else {
            this.selUnit = [];
        }
    }

    setPayerData(facilityId) {

        this.lookDataService.getPayers(facilityId).subscribe((response) => {
            this.payers = response;
            this.listSateService.setPayers(this.payers);
            this.setSelectedPayersForDashboard(this.payers);
            this.payers.map(function(x) {
                x.FacIdAsStringForFiltering = x.FacId.toString();
                return x;
              });

        });
    }

    setSelectedPayersForDashboard(payers: Payer[]) {
        let filteredPayers = this.filterService.filterSettings.get().Payers;

        if (filteredPayers && filteredPayers !== '') {
            filteredPayers = list(filteredPayers.split(',').map(Number));
            this.selPayer = list(payers).Where(a => filteredPayers.Any(t => t === a.OrigPayerId)).ToArray();
        } else {
            this.selPayer = [];
        }
    }

    setQMTypeData() {
        this.qmReportService.getQMTypes().subscribe((response) => {
            const groupId = 1;
            response.forEach(element => {
                element['groupId'] = groupId;
            });
            this.qmTypes = response;
            this.listSateService.setQMs(this.qmTypes);
            this.setQMType(this.qmTypes);
        });
    }

    setQMType(qmType: QMType[]) {
        let filteredQMType = this.filterService.filterSettings.get().QMTypeIDs;
        if (filteredQMType) {
            filteredQMType = list(filteredQMType.split(',').map(Number));
            this.selQMType = list(qmType).Where(a => filteredQMType.Any(t => t === a.QMTypeId)).ToArray();
        } else {
            this.selQMType = [];
        }
    }

    setCategoriesData(facilityId) {
      if (this.isTwentyFourHour) {
        this.lookDataService.getCategories(facilityId).subscribe((response) => {
            this.categories = response;
            this.listSateService.setCategories(this.categories);
            this.setCategoryDataForFilter(this.categories);
        });
      }
    }

    setCategoryDataForFilter(category: Category[]) {
        let filteredCategories = this.filterService.filterSettings.get().Categories;
        if (filteredCategories) {
            filteredCategories = list(filteredCategories.split(','));
            this.selCategories = list(category).Where(a => filteredCategories.Any(t => t === a.TagId)).ToArray();
        } else {
            this.selCategories = [];
        }
    }

    setSelectedOrganization() {
        this.selectedOrganization = this.getSelectedOrganizationForFilter();
    }

    getSelectedOrganizationForFilter(): OrganizationModel {
        if (this.isEnterpriseDashboard()) {
            return this.filterDashboardService.getEnterpriseFromFilterOrDefault();
        } else {
            return this.filterService.organizations.getFirstOrDefault();
        }
    }

    getUnitIdCSV(units: FacilityUnit[]): string {
        let unitIdCSV = null;
        if (units && units.length > 0) {
            unitIdCSV = list(units).Select(a => a.FacilityUnitId).ToArray().join(',');
        }
        return unitIdCSV;
    }

    getPayerIdCSV(payers: Payer[]): string {
        let payerIdCSV = null;
        if (payers && payers.length > 0) {
            payerIdCSV = list(payers).Select(a => a.OrigPayerId).ToArray().join(',');
        }
        return payerIdCSV;
    }
    getQmTypeIdCSV(qmTypes: QMType[]): string {
        let qmTypeIdCSV = null;
        if (qmTypes && qmTypes.length > 0) {
            qmTypeIdCSV = list(qmTypes).Select(a => a.QMTypeId).ToArray().join(',');
        }
        return qmTypeIdCSV;
    }
    getCategoryIdCSV(categories: Category[]): string {
        let CategoriesIdCSV = null;
        if (categories && categories.length > 0) {
            CategoriesIdCSV = list(categories).Select(a => a.TagId).ToArray().join(',');
        }
        return CategoriesIdCSV;
    }
    setTypesData() {
        let filteredTypes = this.filterService.filterSettings.get().Type;
        if (filteredTypes) {
            filteredTypes = list(filteredTypes.split(','));
            this.selType = list(this.type).Where(a => filteredTypes.Any(t => t === a.id)).ToArray();
        } else {
            this.selType = [];
        }
    }
    getTypeIdCSV(types: SelectOption[]): string {
        let typeIdCSV = null;
        if (types && types.length > 0) {
            typeIdCSV = list(types).Select(a => a.id).ToArray().join(',');
        }
        return typeIdCSV;
    }
    setCheckOnlyDischarge(): void {
        const filteredTypesCheckOnlyDischarge = this.filterService.filterSettings.get().OnlyDischargedResidents;
        if (filteredTypesCheckOnlyDischarge) {
            this.chkOnlyDischarged = filteredTypesCheckOnlyDischarge;
        }
    }

    OrgnizationsAndStatusSelected() {
        if (this.filterService.isFilterApplied.get()) {
            if (this.filterService.filterSettings.get()) {
                const filterSettingsValue = this.filterService.filterSettings.get();

                if (this.filterService.filterSettings.get().Organizations) {
                    const orgLists = this.filterService.filterSettings.get().Organizations as OrganizationModel[];
                    this.selMultiFacs = list(this.listSateService.getUserFacilities())
                        .Where(a => list(orgLists)
                            .Any(f => f.OrganizationId === a.OrganizationId)).ToArray();
                    filterSettingsValue.Facilities = this.selMultiFacs;
                    this.filterService.isFilterApplied.set(true);

                    if (this.filterService.filterSettings.get().UserStatuses) {
                        this.selUserStatus = list(this.userStatus)
                            .Where(w => list(this.filterService.filterSettings.get().UserStatuses).Any(a => a === w.id)).ToArray();
                        filterSettingsValue.UserStatuses = this.selUserStatus;
                    }
                }
                this.filterService.filterSettings.set(filterSettingsValue);
            }
        }

    }
}
