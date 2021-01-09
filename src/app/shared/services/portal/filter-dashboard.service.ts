import { Injectable } from '@angular/core';
import { FiltersService } from '../../../filter/store/services/filters.service';
import * as moment from 'moment';
import { FilterSettings } from '../../models/filter-settings';
import { FilterStateService } from '../filter-state.service';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { ListsStateService } from '../../../lists/store/services/lists-state.service';
import { OrganizationModel } from '../../models/organization.model';
import { ReportModel } from '../../models/report.model';
import { RtmsConstantService } from '../rtms-constant.service';
import { FeatureService } from '../feature.service';
import { StateService } from '@uirouter/core';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { UIEventTypes } from '../../enums/ui-event-types';
import { list } from '../../utility/list';
import { Filters } from '../../enums/filters';
import { SelectedChartStateService } from '../selected-chart-state.service';
import { UINotifierService } from '../public/uinotifier.service';

@Injectable()
export class FilterDashboardService {

    public selectedFacilities: Array<OrganizationModel> = [];

    constructor(private filterStateService: FilterStateService,
        private userStateService: UserStateService,
        private filtersService: FiltersService,
        private listsStateService: ListsStateService,
        private rtmsConstantService: RtmsConstantService,
        private featureService: FeatureService,
        private stateService: StateService,
        private uiNotifierService: UINotifierService,
        private selectedChartStateService: SelectedChartStateService
    ) { }

    public setFilterSettings(settings: FilterSettings, isQM?: boolean, isQMCount?: boolean, isQMSummary?: boolean): void {
        this.filterStateService.setFilter(settings);

       const filterUpdatePortalUIEvent = {
            type : UIEventTypes.FilterUpdate,
            value : {
                isQM: isQM,
                isQMCount: isQMCount,
                isQMSummary: isQMSummary
            }
        } as PortalUIEvent;
        this.uiNotifierService.publishEvents(filterUpdatePortalUIEvent);
    }

    public getFilterSettings(isQM?: boolean, isDefault?: boolean, isQMCount?: boolean, isTwentyFourHourReport?: boolean,
        isKeywordSearch?: boolean, isQMSummary?: boolean, isResidentDashboard?: boolean): FilterSettings {
        let filterSettings = this.filtersService.filterSettings.get();
        if (isQM) {
            if (!filterSettings) {
                filterSettings = {
                    EndDate: moment().seconds(0).milliseconds(0),
                    StartDate: moment().seconds(0).milliseconds(0).subtract(7, 'days'),
                    DayRange: 7,
                    QMTypeIDs: null,
                    Units: null,
                    ShortStay: true,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: null,
                };
            } else {
                filterSettings = {
                    StartDate: filterSettings.StartDate,
                    EndDate: filterSettings.EndDate,
                    DayRange: 7,
                    QMTypeIDs: isDefault ? null : this.getSelectedQMTypeIds(),
                    Units: isDefault ? null : this.getSelectedUnitIds(),
                    ShortStay: filterSettings.ShortStay === undefined || isDefault ? true : filterSettings.ShortStay,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: this.getSelectedPayersIds()
                };
            }
        } else if (isQMCount || isQMSummary) {
            if (!filterSettings) {
                filterSettings = {
                    StartDate: filterSettings.StartDate,
                    EndDate: filterSettings.EndDate,
                    DayRange: 0,
                    OrganizationId: null,
                    Units: null,
                    QMTypeIDs: null,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: null
                };
            } else {
                filterSettings = {
                    StartDate: filterSettings.StartDate,
                    EndDate: filterSettings.EndDate,
                    DayRange: 7,
                    QMTypeIDs: isDefault ? null : this.getSelectedQMTypeIds(),
                    Units: isDefault ? null : this.getSelectedUnitIds(),
                    ShortStay: filterSettings.ShortStay === undefined ? true : filterSettings.ShortStay,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: this.getSelectedPayersIds(),
                    RangeFilter: isDefault ? null : filterSettings.RangeFilter
                };
            }
        } else if (isTwentyFourHourReport) {
            if (!filterSettings) {
                filterSettings = {
                    EndDate: moment().seconds(0).milliseconds(0),
                    StartDate: moment().seconds(0).milliseconds(0).subtract(7, 'days'),
                    FilterType: null,
                    FilterValue: null,
                    Categories: null,
                    Units: null,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: null
                };
            } else {
                filterSettings = {
                    StartDate: filterSettings.StartDate,
                    EndDate: filterSettings.EndDate,
                    Units: isDefault ? null : this.getSelectedUnitIds(),
                    FilterType: null,
                    FilterValue: null,
                    Categories: isDefault ? null : this.filtersService.getCategoryTagIdCSV(),
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: this.getSelectedPayersIds()
                };
            }
        } else if (isKeywordSearch) {
            if (!filterSettings) {
                filterSettings = {
                    EndDate: moment().seconds(0).milliseconds(0),
                    StartDate: moment().seconds(0).milliseconds(0).subtract(7, 'days'),
                    FilterType: null,
                    FilterValue: null,
                    Type: null,
                    Units: null,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: null,
                    OnlyDischargedResidents: false

                };
            } else {
                filterSettings = {
                    StartDate: filterSettings.StartDate,
                    EndDate: filterSettings.EndDate,
                    Units: isDefault ? null : this.getSelectedUnitIds(),
                    FilterType: null,
                    FilterValue: null,
                    Type: isDefault ? null : this.filtersService.getTypeIdCSV(),
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: this.getSelectedPayersIds(),
                    OnlyDischargedResidents: filterSettings.OnlyDischargedResidents
                };
            }
        } else if (isResidentDashboard) {
            if (!filterSettings) {
                filterSettings = {
                    StartDate: moment(new Date().setHours(0, 0, 0, 0)).toDate(),
                    EndDate: moment(new Date().setHours(0, 0, 0, 0)).toDate(),
                    FilterType: null,
                    FilterValue: null,
                    Units: null,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: null,
                    ResMRN: ''

                };
        } else {
                filterSettings = {
                    StartDate: filterSettings.StartDate,
                    EndDate: filterSettings.EndDate,
                    Units: isDefault ? null : this.getSelectedUnitIds(),
                    FilterType: null,
                    FilterValue: null,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: this.getSelectedPayersIds(),
                    ResMRN: this.filtersService.filterSettings.get().ResMRN
                };
            }
        } else {
            if (!filterSettings) {
                filterSettings = {
                    StartDate: moment(new Date().setHours(0, 0, 0, 0)).toDate(),
                    EndDate: moment(new Date().setHours(0, 0, 0, 0)).toDate(),
                    Units: null,
                    FilterType: null,
                    FilterValue: null,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: null,
                    DataFilters: []
                };
            } else {
                filterSettings = {

                    StartDate: filterSettings.StartDate,
                    EndDate: filterSettings.EndDate,
                    Facilities: filterSettings.Facilities,
                    UserStatuses: filterSettings.UserStatuses,
                    Units: this.getSelectedUnitIds(),
                    FilterType: null,
                    FilterValue: null,
                    UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                    Payers: this.getSelectedPayersIds(),
                    ResMRN: (isResidentDashboard === undefined || isResidentDashboard) ?
                        this.filtersService.filterSettings.get().ResMRN : '',
                    DataFilters: [],
                    Denominator: false
                };
            }
        }

        filterSettings.OrganizationId = this.getSelectedOrganization().OrganizationId,
            this.filterStateService.setFilter(filterSettings);
        return filterSettings;
    }

    public setInitialDateForDashboard(): void {
        const eDate = moment(new Date().setHours(0, 0, 0, 0)).subtract(1, 'day');
        const sDate = moment(new Date().setHours(0, 0, 0, 0)).subtract(1, 'day');
        const filter = this.getFilterSettings();
        filter.StartDate = sDate.toDate();
        filter.EndDate = eDate.toDate();

        this.setFilterSettings(filter);
    }

    public setInitialDateForUtilizationScore(): void {
        const sDate = moment(new Date().setHours(0, 0, 0, 0)).subtract(7, 'day');
        const eDate = moment(new Date().setHours(0, 0, 0, 0));
        const filter = this.getFilterSettings();
        filter.StartDate = sDate.toDate();
        filter.EndDate = eDate.toDate();

        this.setFilterSettings(filter);
    }

    public setInitialDateForRehospDashboard(): void {
        const eDate = moment().startOf('day');
        const sDate = moment(eDate).subtract(1, 'days');
        const filter = this.getFilterSettings();
        this.listsStateService.getUserFacilities(true).forEach(value => {
            // This was never being executed in old version, as "FacId" and "Facility" variables are wrongly named
            if (value.OrganizationId === filter.OrganizationId && value.OrgLevel < 3) {
                // const facilities = this.listsStateService.getUserFacilities(false);
                // this.setSelectedFacility(facilities[0]);
                // filter.OrganizationId = facilities[0].OrganizationId;
            }
        });
        filter.StartDate = sDate.toDate();
        filter.EndDate = eDate.toDate();
        this.setFilterSettings(filter);
        const filterSettings = this.filtersService.filterSettings.get();
        filterSettings.Payers = null;
        this.filtersService.filterSettings.set(filterSettings);
    }

    public setInitialDateForClinicalDashboard(): void {
        const eDate = this.getClinicalReportBeginTime(moment().seconds(0).milliseconds(0));
        const sDate = moment(eDate).subtract(1, 'days');
        const filter = this.getFilterSettings();
        this.listsStateService.getUserFacilities(true).forEach(value => {
            if (value.OrganizationId === filter.Organization && value.OrganizationType === 1) {
                const facilities = this.listsStateService.getUserFacilities(false);
                this.setSelectedFacility(facilities[0]);
                filter.Organization = facilities[0].OrganizationId;
            }
        });

        filter.StartDate = sDate.toDate();
        filter.EndDate = eDate;
        this.setFilterSettings(filter);
        const filterSettings = this.filtersService.filterSettings.get();
        filterSettings.Payers = null;
        this.filtersService.filterSettings.set(filterSettings);
    }

    public setFacilityAndFilter(facilityId: number): void {
        const facility = this.getFacilityById(facilityId);
        this.setSelectedFacility(facility);
        const filterSettings = this.getFilterSettings();
        filterSettings.Organization = facilityId;
        this.setFilterSettings(filterSettings);
    }

    public setSelectedFacility(facility: OrganizationModel): void {
        this.filtersService.organizations.set([facility]);
    }

    public setSelectedHsOrganization(organization: OrganizationModel): void {
        this.filtersService.selectedHsOrganization.set(organization);
    }

    public setSelectedEnterpriseOrganization(organization: OrganizationModel): void {
      this.filtersService.selectedEnterpriseOrganization.set(organization);
  }

    public setSelectedFacilities(facilities: Array<OrganizationModel>): void {
        this.selectedFacilities = facilities;
    }

    public getDefaultSelectedOrganizationForUtilizationCard(): OrganizationModel {
        const userSettingConstants = this.rtmsConstantService.settings;
        const userOrganizations = this.listsStateService.getUserOrganizations();
        let defaultFacility = userOrganizations[0];
        const userSettings = this.userStateService.getSettings();
        if (userSettings) {
            const setting = userSettings[userSettingConstants.DefaultFacility];
            if (setting && setting.settingObj.SettingValue !== null) {
                userOrganizations.forEach(org => {
                    if (org.OrganizationId === parseInt(setting.settingObj.SettingValue)) {
                        defaultFacility = org;
                    }
                });
            }
        }
        if (defaultFacility === undefined) {
            defaultFacility = userOrganizations[0];
        }
        return defaultFacility;
    }

    public getUserFacilitiesWithFeatureEnabled(feature: string): Array<OrganizationModel> {
        const filteredFacilities = [];

        this.listsStateService.getUserFacilities().forEach(facility => {
            if (this.featureService.isFeatureEnabledForFacility(facility, feature)) {
                filteredFacilities.push(facility);
            }
        });
        return filteredFacilities;
    }

    public getDefaultSelectedFacility(): OrganizationModel {
        return this.userStateService.getDefaultFacility(this.filtersService.allowedOrganizationTypes.get());
    }

    public getSelectedOrganization(): OrganizationModel {
        return this.filtersService.organizations.getFirstOrDefault();
    }

    public getSelectedOrganizationForUtilization(): OrganizationModel {
        return this.getSelectedOrganization();
    }

    public getSelectedFacilities(): Array<OrganizationModel> {
        let returnArray = [];
        const filterSettings = this.filtersService.filterSettings.get();

        if (filterSettings || this.selectedFacilities == null || this.selectedFacilities.length === 0) {
            const fac = this.getDefaultSelectedFacility();
            returnArray.push({ 'id': fac.OrganizationId, 'OrganizationId': fac.OrganizationId });
        } else {
            returnArray = this.selectedFacilities;
        }
        return returnArray;
    }

    public getFacilityById(id: number): OrganizationModel {
        let returnValue = null;

        this.listsStateService.getUserFacilities(true).forEach(fac => {
            if (fac.OrganizationId === id) {
                returnValue = fac;
            }
        });

        return returnValue;
    }

    public getSelectedUnits(): string {
        let unitCSV = '';
        if (this.filtersService.filterSettings.get() && this.filtersService.filterSettings.get().Units) {
            const unitsIdArray = list(this.filtersService.filterSettings.get().Units.split(',').map(Number));
            const unitLists = list( this.listsStateService.getUnits()).Where(a => unitsIdArray.Any(t => t === a.FacilityUnitId)).ToArray();
            unitCSV = list(unitLists).Select(a => a.UnitName).ToArray().join(',');
    }
        return unitCSV;
    }

    public getSelectedUnitIds(): string {
        return this.filtersService.getUnitIdCSV();
    }

    public getSelectedPayers(): string {
        let payersCSV = '';
        if (this.filtersService.filterSettings.get() && this.filtersService.filterSettings.get().Payers) {
            const payersIdArray = list(this.filtersService.filterSettings.get().Payers.split(',').map(Number));
            const payerLists = list(this.listsStateService.getPayers()).Where(a => payersIdArray.
                                    Any(t => t === a.OrigPayerId)).ToArray();
            payersCSV = list(payerLists).Select(a => a.PayerName).ToArray().join(',');
    }
        return payersCSV;
    }

    public getSelectedPayersIds(): string {
        return this.filtersService.getPayersIdCSV();
    }

    public getSelectedQMTypes(): string {
        let qmTypesCSV = '';
        if (this.filtersService.filterSettings.get() && this.filtersService.filterSettings.get().QMTypeIDs) {
            const qmTypesIdArray = list(this.filtersService.filterSettings.get().QMTypeIDs.split(',').map(Number));
            const qmLists = list(this.listsStateService.getQMs()).Where(a => qmTypesIdArray.
                                    Any(t => t === a.QMTypeId)).ToArray();
            qmTypesCSV = list(qmLists).Select(a => a.QMTypeDesc).ToArray().join(',');
    }
        return qmTypesCSV;
    }

    public getSelectedQMTypeIds(): string {
        return this.filtersService.getQmTypeIdCSV();
    }

    public getSelectedCategories(): string {
        let categoriesNameCSV = '';
        if (this.filtersService.filterSettings.get() && this.filtersService.filterSettings.get().Categories) {
            const categoriesIdArray = list(this.filtersService.filterSettings.get().Categories.split(','));
            const categoryLists = list(this.listsStateService.getCategories()).Where(a => categoriesIdArray.
                                    Any(t => t === a.TagId)).ToArray();
            categoriesNameCSV = list(categoryLists).Select(a => a.TagName).ToArray().join(',');
    }
        return categoriesNameCSV;
    }

    public getDischargeOnly(): boolean {
        return this.filtersService.filterSettings.get().OnlyDischargedResidents;
    }

    public getSelectedTypes(): string {
        let typesCSV = '';
        if (this.filtersService.filterSettings.get() && this.filtersService.filterSettings.get().Type) {
            const typesIdArray = list(this.filtersService.filterSettings.get().Type.split(','));
            const typeLists = list(this.listsStateService.getTypes()).Where(a => typesIdArray.
                                    Any(t => t === a.id)).ToArray();
            typesCSV = list(typeLists).Select(a => a.label).ToArray().join(',');
    }
        return typesCSV;
    }

    public getFilterSettingsForReport(ReportId: number, drilldownDetails: any, isDashboard?: boolean, isEnterprise?: boolean): FilterSettings {
        const filterSettings = this.getFilterSettings();
        const filterTypeOverride = '';
        const filterValueOverride = '';

        const eDate = moment(filterSettings.EndDate).toDate();
        const sDate = moment(filterSettings.StartDate).toDate();
        let orgId = filterSettings.OrganizationId;

        if (isEnterprise) {
          orgId = orgId = this.getEnterpriseFromFilterOrDefault().OrganizationId;
        }

        const filterSett: FilterSettings = {
            OrganizationId: orgId,
            StartDate: sDate,
            EndDate: eDate,
            Units: this.getSelectedUnitIds(),
            FilterType: (drilldownDetails.filter && drilldownDetails.filter !== '' ?
                        drilldownDetails.filter.FilterType : (filterTypeOverride === '' ? null : filterTypeOverride)),
            FilterValue: (drilldownDetails.filter && drilldownDetails.filter !== '' ?
                        drilldownDetails.filter.FilterValue : (filterValueOverride === '' ? null : filterValueOverride)),
            UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
            Payers: this.getSelectedPayersIds(),
            IsDashboard: isDashboard,
            IsFilterApplied: this.filtersService.isFilterApplied.get(),
            ResMRN: this.filtersService.filterSettings.get().ResMRN,
            Reportid: ReportId,
            DataFilters: [],
            Denominator: false
        };
        return filterSett;
    }

    public getFilterSettingsForClinicalReport(reportId: number, isDefault: boolean, isEnterprise?: boolean): FilterSettings {
        const isDashboard = this.isClinicalDashboard();
        let filterSettings = this.filtersService.filterSettings.get();

        if (reportId === this.listsStateService.getReportEnumByName('TwentyFourHourReport').Id) {
            filterSettings = this.getFilterSettings(false, isDefault, false, true);
        } else if (reportId === this.listsStateService.getReportEnumByName('KeywordSearch').Id ||
            reportId === this.listsStateService.getReportEnumByName('KeywordCMISearch').Id) {
            filterSettings = this.getFilterSettings(false, isDefault, false, false, true);
        } else {
            filterSettings = this.getFilterSettings();
        }

        const eDate = moment(filterSettings.EndDate).toDate();
        const sDate = moment(filterSettings.StartDate).toDate();
        let orgId = filterSettings.OrganizationId;

        if (isEnterprise) {
          orgId = orgId = this.getEnterpriseFromFilterOrDefault().OrganizationId;
        }

        return {
            OrganizationId: orgId,
            StartDate: sDate,
            EndDate: eDate,
            Units: this.getSelectedUnitIds(),
            Payers: this.getSelectedPayersIds(),
            Categories: filterSettings.Categories,
            FilterType: null,
            FilterValue: null,
            UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
            Type: isDefault ? null : filterSettings.Type,
            IsDashboard: isDashboard,
            IsFilterApplied: this.filtersService.isFilterApplied.get(),
            OnlyDischargedResidents: filterSettings.OnlyDischargedResidents,
            Reportid: reportId,
            DataFilters: []
        };
    }

    public getFilterSettingsForQMReports(reportId: number, isDefault: boolean, isEnterprise?: boolean): FilterSettings {

        const isDashboard = isEnterprise ? isEnterprise : this.isClinicalDashboard();
        let filterSettings = this.filtersService.filterSettings.get();

        if (reportId === this.listsStateService.getReportEnumByName('QMAverageCompare').Id) {
            filterSettings = this.getFilterSettings(true, isDefault);
        } else if (reportId === this.listsStateService.getReportEnumByName('QMCounts').Id ||
            reportId === this.listsStateService.getReportEnumByName('QMSummaryDetail').Id) {
            filterSettings = this.getFilterSettings(false, isDefault, true);
        } else if (reportId === this.listsStateService.getReportEnumByName('QMSummary').Id ||
            reportId === this.listsStateService.getReportEnumByName('QMDetail').Id ||
            reportId === this.listsStateService.getReportEnumByName('LongStayQalityMeasures').Id ||
            reportId === this.listsStateService.getReportEnumByName('ShortStayQalityMeasures').Id) {
            filterSettings = this.getFilterSettings(false, isDefault, false, false, false, true);
        } else {
            filterSettings = this.getFilterSettings();
        }

        const eDate = moment(filterSettings.EndDate).toDate();
        const sDate = moment(filterSettings.StartDate).toDate();

        const returnSettings: FilterSettings = {
            EndDate: eDate,
            StartDate: sDate,
            DayRange: 7,
            OrganizationId: isEnterprise ? this.getEnterpriseFromFilterOrDefault().OrganizationId : filterSettings.OrganizationId,
            RangeFilter: filterSettings.RangeFilter,
            Units: this.getSelectedUnitIds(),
            Payers: this.getSelectedPayersIds(),
            QMTypeID: null,
            QMTypeIDs: !isDashboard ? this.getSelectedQMTypeIds() : null,
            UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
            IsDashboard: isDashboard,
            IsFilterApplied: this.filtersService.isFilterApplied.get(),
            Reportid: reportId,
            SortType: '',
            DataFilters: []
        };

        switch (reportId) {
            case this.listsStateService.getReportEnumByName('ResidentQMCounts').Id:
                returnSettings.DayRange = 0;
                returnSettings.Units = this.getSelectedUnitIds();
                break;
            case this.listsStateService.getReportEnumByName('QMSummaryDetail').Id:
                returnSettings.DayRange = 7;
                break;
            case this.listsStateService.getReportEnumByName('QMCounts').Id:
            case this.listsStateService.getReportEnumByName('QMSummary').Id:
            case this.listsStateService.getReportEnumByName('LongStayQalityMeasures').Id:
            case this.listsStateService.getReportEnumByName('ShortStayQalityMeasures').Id:
            case this.listsStateService.getReportEnumByName('EnterpriseShortStayQM').Id:
            case this.listsStateService.getReportEnumByName('EnterpriseLongStayQM').Id:
            case this.listsStateService.getReportEnumByName('ShortStayQMDetailsByFacility').Id:
            case this.listsStateService.getReportEnumByName('LongStayQMDetailsByFacility').Id:
            case this.listsStateService.getReportEnumByName('ShortStayQMsDetails').Id:
            case this.listsStateService.getReportEnumByName('LongStayQMsDetails').Id:
                returnSettings.RangeFilter = null;
                break;
            case this.listsStateService.getReportEnumByName('ResidentLongStayQMs').Id:
                returnSettings.ShortStay = false;
                break;
            case this.listsStateService.getReportEnumByName('ResidentShortStayQMs').Id:
                returnSettings.ShortStay = true;
                break;
            case this.listsStateService.getReportEnumByName('QMDetail').Id:
                returnSettings.ShortStay = filterSettings.ShortStay === undefined ? true : filterSettings.ShortStay;
                returnSettings.Denominator = false;
                break;
            case this.listsStateService.getReportEnumByName('QMAverageCompare').Id:
                returnSettings.ShortStay = filterSettings.ShortStay === undefined ? true : filterSettings.ShortStay;
                break;
            default:
                throw new Error('Invalid ReportId passed into function filterDashboardService.getFilterSettingsForQMReports');
        }

        return returnSettings;
    }

    public getFilterSettingsForRehosp(reportId: number): FilterSettings {
        const isDashboard = this.isRehospDashboard();
        const filterSettings = this.filtersService.filterSettings.get();
        const filter: FilterSettings = {
            StartDate: filterSettings.StartDate,
            EndDate: filterSettings.EndDate,
            DayRange: 7,
            OrganizationId: this.getFacilityFromFilterOrDefault(),
            Units: this.getSelectedUnitIds(),
            UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
            Payers: this.getSelectedPayersIds(),
            Diagnosis: '',
            ThirtySixtyNinety: 0,
            IsDashboard: isDashboard,
            IsFilterApplied: this.filtersService.isFilterApplied.get(),
            Reportid: reportId,
            DataFilters: []
        };
        this.filterStateService.setFilter(filter);
        return filter;
    }

    public getFilterSettingsForRehospScoring(reportId: number): FilterSettings {

        const isDashboard = this.isRehospDashboard();
        const filterSettings = this.filtersService.filterSettings.get();
        const filter: FilterSettings = {
            StartDate: filterSettings.StartDate,
            EndDate: filterSettings.EndDate,
            OrganizationId: this.getFacilityFromFilterOrDefault(),
            FilterValue: '',
            UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
            Units: this.getSelectedUnitIds(),
            Payers: this.getSelectedPayersIds(),
            IsDashboard: isDashboard,
            IsFilterApplied: this.filtersService.isFilterApplied.get(),
            Reportid: reportId,
            DataFilters: []
        };
        this.filterStateService.setFilter(filter);
        return filter;
    }

    public getFilterSettingsForHSReport(reportId: number, drilldownDetails: any, isDashboard?: boolean, isEnterprise?: boolean): FilterSettings {

        const filterSettings = this.getFilterSettings();
        const filterTypeOverride = '';
        const filterValueOverride = '';

        const eDate = moment(filterSettings.EndDate).toDate();
        const sDate = moment(filterSettings.StartDate).toDate();

        let orgId = 0;

        if (isEnterprise) {
          orgId = orgId = this.getEnterpriseFromFilterOrDefault().OrganizationId;
        } else {
          orgId = this.getHSFromFilterOrDefault().OrganizationId;
        }

        const filter: FilterSettings = {
            OrganizationId: orgId,
            StartDate: sDate,
            EndDate: eDate,
            Units: this.getSelectedUnitIds(),
            FilterType: (drilldownDetails.filter && drilldownDetails.filter !== ''
                ? drilldownDetails.filter.FilterType
                : (filterTypeOverride === '' ? null : filterTypeOverride)),
            FilterValue: (drilldownDetails.filter && drilldownDetails.filter !== ''
                ? drilldownDetails.filter.FilterValue
                : (filterValueOverride === '' ? null : filterValueOverride)),
            UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
            Payers: this.getSelectedPayersIds(),
            IsDashboard: isDashboard,
            IsFilterApplied: this.filtersService.isFilterApplied.get(),
            Reportid: reportId,
            DataFilters: []
        };
        return filter;
    }

    public getFilterSettingsForPortalUsage(): FilterSettings {
        const statuses = [];
        let filterSettings = this.filtersService.filterSettings.get();

        if (filterSettings.UserStatuses) {
          filterSettings.UserStatuses.forEach(value => {
              statuses.push(value.id);
          });
        }

        let selectedOrgs = [];

        if (filterSettings.Facilities && filterSettings.Facilities.length > 0) {
            selectedOrgs = filterSettings.Facilities;
        } else {
            selectedOrgs = this.listsStateService.getUserFacilities(true);
        }

        filterSettings = {
            StartDate : filterSettings.StartDate,
            EndDate : filterSettings.EndDate,
            Organizations: selectedOrgs,
            UserStatuses: statuses,
        };
        this.filterStateService.setFilter(filterSettings);
        return filterSettings;
    }

    public getFilterSettingsForInfectionSurveillance(reportId: number): FilterSettings {
      let filterSettings = this.filtersService.filterSettings.get();
      let selectedOrgs = [];

      if (filterSettings.Facilities && filterSettings.Facilities.length > 0) {
          selectedOrgs = filterSettings.Facilities;
      } else {
          selectedOrgs = this.listsStateService.getUserFacilities(true);
      }

      filterSettings = {
          StartDate : filterSettings.StartDate,
          EndDate : filterSettings.EndDate,
          Organizations: selectedOrgs,
          Reportid: reportId,
          UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId
      };
      this.filterStateService.setFilter(filterSettings);
      return filterSettings;
  }

  public getFilterSettingsForUtilizationScore(reportId: number): FilterSettings {
        let filterSettings = this.filtersService.filterSettings.get();
        if (!filterSettings) {
            filterSettings = {
                EndDate: moment().seconds(0).milliseconds(0),
                StartDate: moment().seconds(0).milliseconds(0).subtract(7, 'days'),
                DayRange: 30,
                Units: null,
                FilterType: null,
                FilterValue: null,
                UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                Payers: null,
                OrganizationId: null,
                Reportid: reportId
            };
        } else {
            filterSettings = {
                StartDate: filterSettings.StartDate,
                EndDate: filterSettings.EndDate,
                DayRange: 30,
                Units: null,
                FilterType: null,
                FilterValue: null,
                UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
                OrganizationId: filterSettings.OrganizationId,
                Reportid: reportId
            };
        }
        this.filterStateService.setFilter(filterSettings);
        return filterSettings;
    }

    public getFacilityFromFilterOrDefault(): Number {
        let facility = this.filtersService.filterSettings.get().OrganizationId;

        if (facility === undefined) {
            facility = this.getDefaultSelectedFacility().OrganizationId;
        }

        return facility;
    }

    public getHSFromFilterOrDefault(): OrganizationModel {
        if (!this.filtersService.selectedHsOrganization.get()) {
            return this.listsStateService.getUserHSOrganization()[0];
        } else {
            return this.filtersService.selectedHsOrganization.get();
        }
    }

    public getEnterpriseFromFilterOrDefault(): OrganizationModel {
      if (!this.filtersService.selectedEnterpriseOrganization.get()) {
          const enterpriseOrgs = this.listsStateService.getUserOrganizations()
          .filter( x => x.OrganizationType === 2 || x.OrganizationType === 3 || x.OrganizationType === 6);
          if ( enterpriseOrgs.length > 0 ) {return enterpriseOrgs[0]; } else { return new OrganizationModel(); }
      } else {
          return this.filtersService.selectedEnterpriseOrganization.get();
      }
    }    

    getSelectedOrganizationId(): any{         
        if (this.filtersService.isEnterpriseDashboard.get() === true) {         
            return this.getEnterpriseFromFilterOrDefault().OrganizationId;
        } else if (this.filtersService.isHSDashboard.get() === true) {      
            return this.getHSFromFilterOrDefault().OrganizationId;
        }else{
            return this.getSelectedOrganization().OrganizationId;
        }
    }

    public removeSelectedType(): void {
        const filterSettings = this.filtersService.filterSettings.get();
        filterSettings.Type = null;
        this.filterStateService.setFilter(filterSettings);
        const portalUIEvent = {
            type: UIEventTypes.ClearFilters,
            value: {
                type:  Filters.Types
            }
        }as PortalUIEvent;
        this.uiNotifierService.publishEvents(portalUIEvent);
    }

    public removeSelectedPayers(): void {
        const filterSettings = this.filtersService.filterSettings.get();
        if (filterSettings) {
            filterSettings.Payers = null;
            this.filterStateService.setFilter(filterSettings);
            const portalUIEvent = {
                type: UIEventTypes.ClearFilters,
                value: {
                    type:  Filters.Payers
                }
            }as PortalUIEvent;
            this.uiNotifierService.publishEvents(portalUIEvent);
        }
    }

    public removeSelectedUnits(): void {
        const filterSettings = this.filtersService.filterSettings.get();
        if (filterSettings) {
            filterSettings.Units = null;
            this.filterStateService.setFilter(filterSettings);
            const portalUIEvent = {
                type: UIEventTypes.ClearFilters,
                value: {
                    type:  Filters.Units
                }
            }as PortalUIEvent;
            this.uiNotifierService.publishEvents(portalUIEvent);
        }
    }

    public removeSelectedQMTypes(): void {
        const filterSettings = this.filtersService.filterSettings.get();
        filterSettings.QMTypeIDs = null;
        this.filterStateService.setFilter(filterSettings);
        const portalUIEvent = {
            type: UIEventTypes.ClearFilters,
            value: {
                type:  Filters.QmTypes
            }
        }as PortalUIEvent;
        this.uiNotifierService.publishEvents(portalUIEvent);
    }

    public removeSelectedCategories(): void {
        const filterSettings = this.filtersService.filterSettings.get();
        filterSettings.Categories = null;
        this.filterStateService.setFilter(filterSettings);
        const portalUIEvent = {
            type: UIEventTypes.ClearFilters,
            value: {
                type:  Filters.Categories
            }
        }as PortalUIEvent;
        this.uiNotifierService.publishEvents(portalUIEvent);
    }

    public removeDischargeOnly(): void {
        const filterSettings = this.filtersService.filterSettings.get();
        if (filterSettings) {
            filterSettings.OnlyDischargedResidents = false;
            this.filterStateService.setFilter(filterSettings);
            const portalUIEvent = {
                type: UIEventTypes.ClearFilters,
                value: {
                    type:  Filters.OnlyDischargedResidents
                }
            }as PortalUIEvent;
            this.uiNotifierService.publishEvents(portalUIEvent);
        }
    }

    public getClinicalReportBeginTime(currentDateTime): Date {
        const currentMoment = moment().seconds(0).milliseconds(0);
        if (currentMoment.minutes() > 30) {

            currentMoment.add(1, 'hour');
            currentDateTime = moment(currentDateTime).hour(currentMoment.hour()).startOf('hour');
        } else {
            currentDateTime = moment(currentDateTime).hour(currentMoment.hour()).minutes(30);
        }
        return currentDateTime;
    }

    public useSingleDate(location: string): boolean {
        if (location === 'home.financial') {
            return true;
        } else if (location === 'home.clinical') {
            return true;
        } else if (location === 'home.utilizationScoreCard') {
            return false;
        } else if (location === 'home.reportDashboard') {
            const selectedReport = this.selectedChartStateService.getSelectedReport();
            const reportId = selectedReport ? selectedReport.reportId : null;
            if (reportId !== null && (reportId === this.listsStateService.getReportEnumByName('CARDDetail').Id ||
                reportId === this.listsStateService.getReportEnumByName('PPS').Id ||
                reportId === this.listsStateService.getReportEnumByName('PDPMWorksheet').Id ||
                reportId === this.listsStateService.getReportEnumByName('ResidentList').Id ||
                reportId === this.listsStateService.getReportEnumByName('ActiveCOVID19Diagnosis').Id)
                || reportId === this.listsStateService.getReportEnumByName('InfectionControlLog').Id
            ) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    public isClinicalDashboard(): boolean {
        return (this.stateService.current.name === 'home.clinical' || this.stateService.current.name === 'home.detailDashboard' ||
            this.stateService.current.name === 'home.genericDashboard' || this.stateService.current.name === 'home.hospitalDashboard');
    }

    public isRehospDashboard(): boolean {
        return (this.stateService.current.name === 'home.rehospitalization' || this.stateService.current.name === 'rehospdetails' ||
            this.stateService.current.name === 'home.genericDashboard' || this.stateService.current.name === 'home.detailDashboard' ||
            this.stateService.current.name === 'home.hospitalDashboard'
            );
    }
}
