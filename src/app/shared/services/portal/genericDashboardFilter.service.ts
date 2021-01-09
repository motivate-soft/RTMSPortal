import { Injectable } from '@angular/core';
import { FilterSettings } from '../../models/filter-settings';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { FilterDashboardService } from './filter-dashboard.service';
import { SelectedChartService } from '../selected-chart.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { RtmsConstantService } from '../rtms-constant.service';
import * as moment from 'moment';
import { StateService } from '@uirouter/core';
import { CardFilterStateService } from '../card-filter-state.service';
import { DrillDownStateService } from 'src/app/drill-down/store/services/drill-down-state.service';
import { DataFilter } from '../../models/data-filter';
import { FilterSettingsDto } from '../../models/filter-settings-dto';
import { select } from '@ngrx/store';
import { ReportDataFilterStateService } from '../report-data-filter-state.service';
import { elementAt } from 'rxjs/operators';


@Injectable()
export class GenericDashboardFilterService {
    constructor(private listsStateService: ListsStateService,
        private filterDashboardService: FilterDashboardService,
        private selectedChartService: SelectedChartService,
        private filtersService: FiltersService,
        private rtmsConstantService: RtmsConstantService,
        private stateService: StateService,
        private cardFilterStateService: CardFilterStateService,
        private drillDownStateService: DrillDownStateService,
        private reportDatafilterStateService: ReportDataFilterStateService
    ) { }

    getQMReportsFilter(dashboardControl, selectedChartDetails, isDetailDashboard, isReportDashboard): FilterSettingsDto {
        if (isReportDashboard) {
            return this.getQMReportsReportDashboardFilter(dashboardControl, selectedChartDetails);
        } else if (isDetailDashboard) {
            return this.getQMReportsDetailDashboardFilter(dashboardControl, selectedChartDetails);
        } else {
            const filterSettingsDto = new FilterSettingsDto();
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForQMReports(dashboardControl.ReportId, true, this.isEnterpriseDashboard());
            return filterSettingsDto;
        }
    }

    getQMReportsReportDashboardFilter(dashboardControl, selectedChartDetails): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForQMReports(dashboardControl.ReportId, false);
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('QMDetail').Id) {
            if (selectedChartDetails.filter && selectedChartDetails.category) {
                filterSettingsDto.QMTypes = selectedChartDetails.category.replace('*', '');
                if (this.listsStateService.getQMs().length > 0) {
                    this.listsStateService.getQMs().map(val => {
                        if (selectedChartDetails.category.replace('*', '') === val.QMTypeDesc.replace('*', '')) {
                            filterSettingsDto.FilterSettings.QMTypeID = val.QMTypeId;
                        }
                    });
                }
                filterSettingsDto.FilterSettings.SortType = selectedChartDetails.series;
            } else {
                filterSettingsDto.FilterSettings.user = selectedChartDetails.filter.user;
                filterSettingsDto.FilterSettings.ShortStay = selectedChartDetails.filter.ShortStay;
                filterSettingsDto.FilterSettings.QMTypeID = selectedChartDetails.filter.QMTypeID;
                filterSettingsDto.FilterSettings.Sort = selectedChartDetails.filter.Sort;
                filterSettingsDto.FilterSettings.Denominator = selectedChartDetails.filter.Denominator;
                this.listsStateService.getQMs().forEach(val => {
                    if (val.QMTypeId === filterSettingsDto.FilterSettings.QMTypeID) {
                        filterSettingsDto.QMTypes = val.QMTypeDesc;
                    }
                });
            }
        }
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('LongStayQalityMeasures').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ShortStayQalityMeasures').Id) {
            filterSettingsDto.FilterSettings.ShortStay = dashboardControl.ReportId ===
                this.listsStateService.getReportEnumByName('ShortStayQalityMeasures').Id ? 1 : 0;
            filterSettingsDto.FilterSettings.ReportId = this.listsStateService.getReportEnumByName('QMSummary').Id;
        }
        return filterSettingsDto;
    }

    getQMReportsDetailDashboardFilter(dashboardControl, selectedChartDetails): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForQMReports(dashboardControl.ReportId, false, this.isEnterpriseDashboard());
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('QMDetail').Id) {
            filterSettingsDto.FilterSettings.ShortStay = selectedChartDetails.reportId
                === this.listsStateService.getReportEnumByName('ResidentShortStayQMs').Id ? 1 : 0;
            filterSettingsDto.FilterSettings.SortType = selectedChartDetails.series;
            // this is so "Detail Date" will display in the report header
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
        }
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('QMSummaryDetail').Id) {
            filterSettingsDto.FilterSettings.IsFilterApplied = true;
            filterSettingsDto.FilterSettings.RangeFilter = selectedChartDetails.filter.RangeFilter;
            filterSettingsDto.FilterSettings.DayRange = selectedChartDetails.filter.DayRange;
        } else if (this.isEnterpriseDashboard()
            && (
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterpriseShortStayQM').Id ||
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterpriseLongStayQM').Id
            )
        ) {
            filterSettingsDto.FilterSettings.ShortStay = selectedChartDetails.reportId ===
                this.listsStateService.getReportEnumByName('EnterpriseShortStayQM').Id ? 1 : 0;
        } else if (this.isEnterpriseDashboard()
            && (
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ShortStayQMDetailsByFacility').Id ||
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('LongStayQMDetailsByFacility').Id
            )
        ) {
            filterSettingsDto.FilterSettings.IsFilterApplied = true;
        } else if (this.isEnterpriseDashboard()
            && (
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ShortStayQMsDetails').Id ||
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('LongStayQMsDetails').Id
            )
        ) {
            filterSettingsDto.FilterSettings.IsFilterApplied = true;
            if (selectedChartDetails.filter.FilterType) {
                filterSettingsDto.FilterSettings.OrganizationId = this.listsStateService.getOrganizationIdByName(selectedChartDetails.filter.FilterValue);
            }
        }
        filterSettingsDto.FilterSettings.DataFilters = this.getQMReportsDataFilters(dashboardControl, selectedChartDetails);
        return filterSettingsDto;
    }

    getQMReportsDataFilters(dashboardControl, selectedChartDetails): DataFilter[] {
        const dataFilters = [];
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('QMDetail').Id) {
            dataFilters
                .push(this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.category));
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.None, selectedChartDetails.series));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('QMSummaryDetail').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ResidentQMCounts').Id) {
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.None, selectedChartDetails.filter.FilterValue));
        } else if (this.isEnterpriseDashboard() && (
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ShortStayQMDetailsByFacility').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('LongStayQMDetailsByFacility').Id)) {

            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.QM, selectedChartDetails.filter.FilterValue));
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.CorporationStateNational, selectedChartDetails.series));
        } else if (this.isEnterpriseDashboard() && (
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ShortStayQMsDetails').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('LongStayQMsDetails').Id)) {

            if (selectedChartDetails.filter.FilterType) {
                dataFilters.push(
                    this.addDataFilter(this.rtmsConstantService.filterTypes.QM, selectedChartDetails.series));
                dataFilters.push(
                    this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
            } else {
                dataFilters.push(
                    this.addDataFilter(this.rtmsConstantService.filterTypes.QM, selectedChartDetails.filter.FilterValue));
            }
        }
        return dataFilters;
    }

    getClinicalDashboardReportsFilter(dashboardControl, selectedChartDetails, isDetailDashboard, isReportDashboard): FilterSettingsDto {
        if (isReportDashboard) {
            return this.getClinicalDashboardReportsReportDashboardFilter(dashboardControl);
        } else if (isDetailDashboard) {
            return this.getClinicalDashboardReportsDetailDashboardFilter(dashboardControl, selectedChartDetails);
        } else {
            const filterSettingsDto = new FilterSettingsDto();
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForClinicalReport(dashboardControl.ReportId, !isDetailDashboard, this.isEnterpriseDashboard());
            return filterSettingsDto;
        }
    }

    getClinicalDashboardReportsReportDashboardFilter(dashboardControl): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForClinicalReport(dashboardControl.ReportId, false);
        if (filterSettingsDto.FilterSettings.Categories && filterSettingsDto.FilterSettings.Categories !== '') {
            filterSettingsDto.FilterSettings.DataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.AlertsCategory, filterSettingsDto.FilterSettings.Categories));
        }
        filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
        return filterSettingsDto;
    }

    getClinicalDashboardReportsDetailDashboardFilter(dashboardControl, selectedChartDetails): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForClinicalReport(dashboardControl.ReportId, false, this.isEnterpriseDashboard());
        if (dashboardControl.ReportId !== selectedChartDetails.reportId) {
            if (this.isEnterpriseDashboard()
                && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AverageTherapyMinuteDetail').Id) {
                filterSettingsDto.FilterSettings.IsFilterApplied = true;
            }
            filterSettingsDto.FilterSettings.DataFilters = this.getClinicalDashboardReportsDataFilters(dashboardControl, selectedChartDetails);
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
        }
        return filterSettingsDto;
    }

    getClinicalDashboardReportsDataFilters(dashboardControl, selectedChartDetails): DataFilter[] {
        const dataFilters = [];
        if (this.isEnterpriseDashboard()
            && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AverageTherapyMinuteDetail').Id) {
            if (selectedChartDetails.filter.FilterType) {
                dataFilters.push(
                    this.addDataFilter(this.rtmsConstantService.filterTypes.Facility, selectedChartDetails.series));
                dataFilters.push(
                    this.addDataFilter(this.rtmsConstantService.filterTypes.Month, selectedChartDetails.filter.FilterValue));
            } else {
                dataFilters.push(
                    this.addDataFilter(this.rtmsConstantService.filterTypes.Facility, selectedChartDetails.filter.FilterValue));
            }
        } else if (selectedChartDetails.filter.FilterType && selectedChartDetails.filter.FilterValue) {
            dataFilters.push(
                this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
        }
        return dataFilters;
    }

    getRehospitalizationDashboardReportsFilter(dashboardControl, selectedChartDetails, isDetailDashboard, isReportDashboard): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.SelectedChartDetails = selectedChartDetails;
        if (isReportDashboard) {
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForClinicalReport(dashboardControl.ReportId, !isReportDashboard);
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
        } else if (isDetailDashboard) {
            return this.getRehospitalizationDashboardReportsDetailDashboardFilter(dashboardControl, selectedChartDetails);
        } else {
            filterSettingsDto.FilterSettings = this.getRehospDashboardReportsDefaultFilter(dashboardControl.ReportId);
        }

        return filterSettingsDto;
    }

    getRehospitalizationDashboardReportsDetailDashboardFilter(dashboardControl, selectedChartDetails): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.FilterSettings = this.getRehospDashboardReportsDefaultFilter(dashboardControl.ReportId);

        if (dashboardControl.ReportId !== selectedChartDetails.reportId) {
            if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ReadmissionRateDetails').Id) {
                const dateformat = selectedChartDetails.category.split('/');
                const dateformatString = dateformat[0] + '/1/' + dateformat[1];
                filterSettingsDto.FilterSettings.StartDate = moment(new Date(dateformatString)).utc().toDate();
                selectedChartDetails.filter.FilterValue = selectedChartDetails.series;
                filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.StartDate).format('MM/YYYY');
            } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('DaysPerThousandDetail').Id &&
                selectedChartDetails.filter.FilterType !== this.rtmsConstantService.filterTypes.Payer) {
                selectedChartDetails.filter.FilterType = selectedChartDetails.series === 'Long Stay' ?
                    this.rtmsConstantService.filterTypes.LongStay : this.rtmsConstantService.filterTypes.ShortStay;
                filterSettingsDto.FilterSettings.FilterType = selectedChartDetails.filter.FilterType;
                filterSettingsDto.DetailInfo = selectedChartDetails.filter.DetailInfo;
            } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ReadmissionRateDetailsDx').Id ||
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ReadmittedPrimaryDx3090Detail').Id) {
                switch (selectedChartDetails.series.toLowerCase()) {
                    case 'last 30 days':
                        filterSettingsDto.FilterSettings.ThirtyNinety = 30;
                        break;
                    default:
                        filterSettingsDto.FilterSettings.ThirtyNinety = 90;
                }
                filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
            } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AverageLOSDetail').Id) {
                filterSettingsDto.DetailInfo = selectedChartDetails.filter.FilterValue === 'Current' ? moment().format('MM/YYYY')
                    : selectedChartDetails.filter.FilterValue;
                filterSettingsDto.FilterSettings.IsDrillDown = true;
            } else {
                filterSettingsDto.DetailInfo = selectedChartDetails.filter.DetailInfo ? selectedChartDetails.filter.DetailInfo
                    : moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
                filterSettingsDto.FilterSettings.IsDrillDown = true;
            }
            filterSettingsDto.FilterSettings.DataFilters = this.getRehospitalizationDashboardReportsDataFilters(dashboardControl, selectedChartDetails);
        }

        filterSettingsDto.SelectedChartDetails = selectedChartDetails;
        return filterSettingsDto;
    }

    getRehospitalizationDashboardReportsDataFilters(dashboardControl, selectedChartDetails): DataFilter[] {
        const dataFilters = [];
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ReadmissionRateDetails').Id) {
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.PayerCategory, selectedChartDetails.filter.FilterValue));
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.MonthYear, selectedChartDetails.category));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('DaysPerThousandDetail').Id &&
            selectedChartDetails.filter.FilterType !== this.rtmsConstantService.filterTypes.Payer) {
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.None, selectedChartDetails.series));
            dataFilters.push(
                this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ReadmissionRateDetailsDx').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ReadmittedPrimaryDx3090Detail').Id) {
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.Diagnosis, selectedChartDetails.filter.FilterValue));
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.ThirtyNinety, selectedChartDetails.series));
        } else {
            dataFilters.push(
                this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
        }
        return dataFilters;
    }

    getHSDashboardReportsFilter(dashboardControl, selectedChartDetails, isDetailDashboard, isReportDashboard, allFacsSelectedForDrilldown): FilterSettingsDto {
        if (isDetailDashboard) {
            return this.getHSDashboardReportsDetailDashboardFilter(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown);
        } else {
            const filterSettingsDto = new FilterSettingsDto();
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForHSReport(dashboardControl.ReportId, '', true, this.isEnterpriseDashboard());

            if (!isReportDashboard) {
                filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(dashboardControl.ReportId);
            }

            return filterSettingsDto;
        }
    }

    getHSDashboardReportsDetailDashboardFilter(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForHSReport(dashboardControl.ReportId, '', true, this.isEnterpriseDashboard());
        filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(selectedChartDetails.reportId);
        if ((dashboardControl.ReportId !== selectedChartDetails.reportId || dashboardControl.data.isFooterGrid)
            && selectedChartDetails.filter) {
            filterSettingsDto.FilterSettings.IsDrillDown = true;
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosis').Id
                    || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('FacilityReadmissionsByPrimaryDiagnosis').Id) {
            filterSettingsDto.FilterSettings.IsDrillDown = true;
        }
        if (dashboardControl.data['parentReportId'] === this.listsStateService.getReportEnumByName('FacilityReadmissionsByPrimaryDiagnosis').Id) {
            filterSettingsDto.FilterSettings.CardFilterSelectedValue=this.checkCardFilter(this.listsStateService.getReportEnumByName('FacilityReadmissionsByPrimaryDiagnosis').Id);
        }
        filterSettingsDto.FilterSettings.DataFilters = this.getHSDashboardReportsDataFilters(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown);
        return filterSettingsDto;
    }

    getHSDashboardReportsDataFilters(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown): DataFilter[] {
        let dataFilters = [];
        if ((dashboardControl.ReportId !== selectedChartDetails.reportId || dashboardControl.data.isFooterGrid)
            && selectedChartDetails.filter) {
            if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('CardReadmissionRiskDistributionDetail').Id) {
                if (selectedChartDetails.series) {
                    dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.RiskLevel, selectedChartDetails.series));
                    dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.Facility,
                        selectedChartDetails.filter.FilterValue));
                } else {
                    dataFilters.push(this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
                }
            } else {
                if (dashboardControl.ReportId !== this.listsStateService.getReportEnumByName('CardReadmissionRiskDistributionByFacility').Id) {
                    dataFilters.push(this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.category));
                }
            }
        }
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosisDetail').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosisTrending').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSFacilityReadmissionsByPrimaryDiagnosis').Id) {

            dataFilters = this.getFiltersforPrimaryDiagnosis(selectedChartDetails, allFacsSelectedForDrilldown);

        } else if (this.isEnterpriseDashboard() &&
            (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSProACTDaysPer1000Detail').Id) &&
            selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('HSProACTDaysPer1000').Id) {
            dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.Month, selectedChartDetails.series));

        } else if (this.isEnterpriseDashboard() &&
            (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSProACTAdmissions1000Detail').Id) &&
            selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('HSProACTAdmissions1000').Id) {
            dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.Month, selectedChartDetails.series));
        } else if (this.isEnterpriseDashboard() &&
            (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSRehospitalizationRateDetail').Id) &&
            selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('HSRehospitalizationRate').Id) {
            dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.Month, selectedChartDetails.series));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HSAverageLOSDetail').Id) {
            const facilityFilterIndex = dataFilters.findIndex(s => s.FilterType === 'Facility');
            if (facilityFilterIndex >= 0) {
                dataFilters.splice(facilityFilterIndex, 1);
            }
            if (selectedChartDetails.series === 'Current ALOS') {
                dataFilters.push(this.addDataFilter('LOSFacilityCurrent', selectedChartDetails.category));
            } else {
                dataFilters.push(this.addDataFilter('LOSFacilityHistorical', selectedChartDetails.category));
            }
        }
        return dataFilters;
    }

    getReportsFilter(dashboardControl, selectedChartDetails, isDetailDashboard, isReportDashboard,
      allFacsSelectedForDrilldown): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        if (isReportDashboard) {
          if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('InfectionSurveillance').Id) {
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForInfectionSurveillance(dashboardControl.ReportId);
            filterSettingsDto.FilterSettings.IsFilterApplied = this.filtersService.isFilterApplied.get();
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
            return filterSettingsDto;
          } else {
            return this.getReportsReportDashboardFilter(dashboardControl, selectedChartDetails);
          }
            return this.getReportsReportDashboardFilter(dashboardControl, selectedChartDetails);
        } else if (isDetailDashboard) {
            return this.getReportsDetailDashboardFilter(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown);
        } else {
            const filterSettingsDto = new FilterSettingsDto();
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForReport(dashboardControl.ReportId, '', true, this.isEnterpriseDashboard());
            if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ResidentAbnormalLabs').Id
                || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('Labs').Id
                || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterprisePDPMSummary').Id
                || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByClass').Id
                || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('InfectionTypes').Id
            || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByProvider').Id
            || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsByFacility').Id) {
                filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(dashboardControl.ReportId);
            }
            return filterSettingsDto;
        }
    }

    getReportsReportDashboardFilter(dashboardControl, selectedChartDetails): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.SelectedChartDetails = selectedChartDetails;
        filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForReport(dashboardControl.ReportId, '', false, this.isEnterpriseDashboard());
        filterSettingsDto.FilterSettings.IsDrillDown = selectedChartDetails.filter.IsDrillDown;
        filterSettingsDto.FilterSettings.Denominator = selectedChartDetails.filter.Denominator;
        filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');

        if (filterSettingsDto.FilterSettings.IsDrillDown) {
            if (!selectedChartDetails.filter.DataFilters || selectedChartDetails.filter.DataFilters.length === 0) {
                filterSettingsDto.FilterSettings.DataFilters = [];
                if (dashboardControl.data['parentReportId'] === selectedChartDetails.reportId) {
                    return this.setFilterSettingsForADLDistTrendingDetail(filterSettingsDto);
                } else {
                    filterSettingsDto.FilterSettings.DataFilters.push(
                        this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
                }
            } else {
                filterSettingsDto.FilterSettings.DataFilters = selectedChartDetails.filter.DataFilters;
            }
        }
        return filterSettingsDto;
    }

    getReportsDetailDashboardFilter(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForReport(dashboardControl.ReportId, '', true, this.isEnterpriseDashboard());
        filterSettingsDto.SelectedChartDetails = selectedChartDetails;
        if (selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('MDSQRP').Id) {
            filterSettingsDto.SelectedChartDetails.pointX = filterSettingsDto.SelectedChartDetails.pointY = '';
        } else if (selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByClass').Id
            || selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByClassPerUnit').Id) {
            filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(this.listsStateService.getReportEnumByName('AntibioticOrdersByClass').Id);
        } else if (selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('InfectionTypes').Id
            || selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('InfectionTypesPerUnit').Id) {
            filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(this.listsStateService.getReportEnumByName('InfectionTypes').Id);
        } else if ((this.isEnterpriseDashboard() && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterpriseADLRUGsIVDistributionDetail').Id)
            || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('FacilityPayerRatio').Id
            || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('FacilityPayerRatioDetail').Id
            || (dashboardControl.Category === 'pdpm' && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('PDPMWorksheet').Id)) {
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByProvider').Id 
            || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByProviderDetail').Id) {
          filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(selectedChartDetails.reportId);
        } else if (this.isEnterpriseDashboard() && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('MDSQRPDetail').Id) {
            filterSettingsDto.FilterSettings.isFilterApplied = true;
            filterSettingsDto.FilterSettings.OrganizationId = this.listsStateService.getOrganizationIdByName(selectedChartDetails.filter.FilterValue);
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterpriseIllogicalADLCodingTrending').Id) {
            filterSettingsDto.FilterSettings.StartDate = selectedChartDetails.filter.StartDate;
            filterSettingsDto.FilterSettings.OrganizationId = this.listsStateService.getOrganizationIdByName(selectedChartDetails.filter.FilterValue);
        } else if (this.isEnterpriseDashboard() &&
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('IllogicalADLDetail').Id) {
            const illogicalADLCodingChartData = this.drillDownStateService.getDrillDownHistory().
                find(a => a.reportId === this.listsStateService.getReportEnumByName('EnterpriseIllogicalADLCoding').Id);
            if (illogicalADLCodingChartData) {
                filterSettingsDto.FilterSettings.OrganizationId = this.listsStateService.getOrganizationIdByName(illogicalADLCodingChartData.filter.FilterValue);
            }
        } else if (this.isEnterpriseDashboard() && (
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AverageTherapyMinutes').Id
            || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AverageTherapyMinsByDiagnosis').Id)) {
            filterSettingsDto.FilterSettings.OrganizationId = this.listsStateService.getOrganizationIdByName(selectedChartDetails.filter.FilterValue);
        } else if (this.isEnterpriseDashboard() && (
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterprisePDPMSummary').Id
            || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterprisePDPMSummaryByFacility').Id)) {
            filterSettingsDto.FilterSettings.IsFilterApplied = true;
        } else if (this.isEnterpriseDashboard() && (
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterprisePDPMSummaryDetail').Id)) {
            filterSettingsDto.FilterSettings.IsFilterApplied = true;
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
         } else if (this.isEnterpriseDashboard() && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsByFacility').Id) {
            filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsByFacility').Id);
         } else if (this.isEnterpriseDashboard() &&  dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsCurrent').Id) {
            filterSettingsDto.FilterSettings.OrganizationId =this.listsStateService.getOrganizationIdByName(selectedChartDetails.filter.FilterValue);
            filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsByFacility').Id);
            filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
         } else if(this.isEnterpriseDashboard() && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('IPAAlertDetail').Id) {    
                filterSettingsDto.FilterSettings.MDSId = selectedChartDetails.filter.MDSId;    
                const ipaAlertsChartData = this.drillDownStateService.getDrillDownHistory().find(a => a.reportId === this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsByFacility').Id);
                if (ipaAlertsChartData) {
                    filterSettingsDto.FilterSettings.OrganizationId = this.listsStateService.getOrganizationIdByName(ipaAlertsChartData.filter.FilterValue);
                    filterSettingsDto.FilterSettings.CardFilterSelectedValue = this.checkCardFilter(this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsByFacility').Id);
                    filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
                }
        } else {
            if ((dashboardControl.ReportId !== selectedChartDetails.reportId || dashboardControl.data.isFooterGrid)
                && selectedChartDetails.filter) {
                if (dashboardControl.data['parentReportId'] ===
                    this.listsStateService.getReportEnumByName('RUGsIVADLDistributionBarChart').Id) {
                    return this.setFilterSettingsForADLDistTrendingDetail(filterSettingsDto);
                } else {
                    filterSettingsDto.FilterSettings.StartDate = selectedChartDetails.filter.StartDate;
                    filterSettingsDto.FilterSettings.MDSId = selectedChartDetails.filter.MDSId;
                    filterSettingsDto.FilterSettings.IsDrillDown = true;
                    filterSettingsDto.DetailInfo = selectedChartDetails.filter.DetailInfo;
                }
            }
        }
        filterSettingsDto.FilterSettings.DataFilters = this.getReportsDataFilters(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown);
        return filterSettingsDto;
    }

    getReportsDataFilters(dashboardControl, selectedChartDetails, allFacsSelectedForDrilldown): DataFilter[] {
        let dataFilters = [];
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('TherapyFunctionalScoreDetail').Id) {
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.FunctionalScoreCategory,
                    selectedChartDetails.filter.FilterValue));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterpriseQRPPercentages').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('MDSQRP').Id ||
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('ADLRUGsIVDistribution').Id) {
            dataFilters = [];
        } else if (this.isEnterpriseDashboard() && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('MDSQRPDetail').Id) {
            dataFilters.push(
                this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.Quarter, selectedChartDetails.series));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterpriseIllogicalADLCodingTrending').Id) {
            dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.Facility,
                selectedChartDetails.filter.FilterValue));
            dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.Month,
                selectedChartDetails.series));
        } else if (this.isEnterpriseDashboard() &&
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('IllogicalADLDetail').Id) {
            dataFilters.push(
                this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
        } else if (this.isEnterpriseDashboard() &&
            dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterpriseADLRUGsIVDistributionDetail').Id) {
            if (selectedChartDetails.series) {
                dataFilters.push(
                    this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.series));
                dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.Facility,
                    selectedChartDetails.filter.FilterValue));
            } else {
                dataFilters.push(
                    this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
            }
        } else if (
            (this.isEnterpriseDashboard() && (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AverageTherapyMinutes').Id
                || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AverageTherapyMinsByDiagnosis').Id))
            || (dashboardControl.Category === 'pdpm' && dashboardControl.ReportId === this.listsStateService.getReportEnumByName('PDPMWorksheet').Id)) {
            dataFilters.push(this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
        } else if (
            (this.isEnterpriseDashboard() &&
                (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterprisePDPMSummary').Id))) {
            dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.PDPMSummaryCategory, selectedChartDetails.series));
        } else if (
            (this.isEnterpriseDashboard() &&
                dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterprisePDPMSummaryByFacility').Id)) {
            dataFilters = this.reportDatafilterStateService.getReportDataFilterForReport(selectedChartDetails.reportId);
            dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.PDPMSummarySubCategory, selectedChartDetails.filter.FilterValue));
        } else if (
            (this.isEnterpriseDashboard() &&
                (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('EnterprisePDPMSummaryDetail').Id))) {
            dataFilters = this.reportDatafilterStateService.getReportDataFilterForReport(selectedChartDetails.reportId);
            if (selectedChartDetails.filter.FilterType) {
                dataFilters.push(this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
            } else {
                dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.PDPMSummarySubCategory, selectedChartDetails.filter.FilterValue));
            }
         } else if (
            (this.isEnterpriseDashboard()
                && (selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('EntrpriseIPAAlertsCurrent').Id)
                && (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('IPAAlertDetail').Id))
            ){
                    dataFilters = this.reportDatafilterStateService.getReportDataFilterForReport(selectedChartDetails.reportId);
                    dataFilters.push( this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
          } 
        else {
            if ((dashboardControl.ReportId !== selectedChartDetails.reportId || dashboardControl.data.isFooterGrid)
                && selectedChartDetails.filter) {
                dataFilters = [];
                if (dashboardControl.data['parentReportId'] !==
                    this.listsStateService.getReportEnumByName('RUGsIVADLDistributionBarChart').Id) {
                    if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('FacilityPayerRatio').Id ||
                        dashboardControl.ReportId === this.listsStateService.getReportEnumByName('FacilityPayerRatioDetail').Id) {
                        dataFilters = this.getFiltersforPayerRatio(selectedChartDetails, allFacsSelectedForDrilldown);
                    } else {
                        dataFilters.push(
                            this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
                    }
                }
            } else {
                if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('FacilityPayerRatio').Id) {
                    dataFilters = this.getFiltersforPayerRatio(selectedChartDetails, allFacsSelectedForDrilldown);
                }
            }
        }
        return dataFilters;
    }

    getAdminReportsFilter(dashboardControl): FilterSettingsDto {
        const filterSettingsDto = new FilterSettingsDto();
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('FacPortalUsage').Id) {
            filterSettingsDto.DetailInfo = moment(new Date()).format('MM/DD/YYYY');
            filterSettingsDto.FilterSettings = null;
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('KeywordsByFacility').Id) {
            filterSettingsDto.DetailInfo = moment(new Date()).format('MM/DD/YYYY');
            filterSettingsDto.FilterSettings = {
                FacilityId: this.filterDashboardService.getSelectedOrganization().OrganizationId,
                ReportId: this.listsStateService.getReportEnumByName('KeywordsByFacility').Id
            };
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('PortalUsage').Id) {
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForPortalUsage();
            filterSettingsDto.FilterSettings.reverseSort = this.stateService.params.reverseSort;
            filterSettingsDto.FilterSettings.IsFilterApplied = this.filtersService.isFilterApplied.get();
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('UtilizationScore').Id) {
            filterSettingsDto.FilterSettings = this.filterDashboardService.getFilterSettingsForUtilizationScore(dashboardControl.ReportId);
            filterSettingsDto.DetailInfo = ` ${moment(filterSettingsDto.FilterSettings.StartDate).format('MM/DD/YYYY')}
          - ${moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY')}`;
        }
        return filterSettingsDto;
    }

    getFiltersforPrimaryDiagnosis(selectedChartData, allFacsSelectedForDrilldown) {
        if (allFacsSelectedForDrilldown) {
            return [this.addDataFilter(selectedChartData.filter.FilterType, selectedChartData.filter.FilterValue)];
        } else {
            return [
                this.addDataFilter('Facility', selectedChartData.category),
                this.addDataFilter(selectedChartData.filter.FilterType, selectedChartData.series)
            ];
        }
    }

    getFiltersforPayerRatio(selectedChartDetails, allFacsSelectedForDrilldown) {
        if (allFacsSelectedForDrilldown) {
            return [this.addDataFilter(this.rtmsConstantService.filterTypes.PayerRatioDetail,
                selectedChartDetails.point.name === undefined ? selectedChartDetails.series : selectedChartDetails.point.name)];
        } else {
            return [
                this.addDataFilter(this.rtmsConstantService.filterTypes.Facility, selectedChartDetails.category),
                this.addDataFilter(this.rtmsConstantService.filterTypes.PayerRatioDetail, selectedChartDetails.series)
            ];
        }
    }

    getRehospDashboardReportsDefaultFilter(reportId): FilterSettings {
        return (reportId === this.listsStateService.getReportEnumByName('CARD').Id ||
            reportId === this.listsStateService.getReportEnumByName('CARDDetail').Id ||
            reportId === this.listsStateService.getReportEnumByName('AverageLOSDetail').Id)
            ? this.filterDashboardService.getFilterSettingsForRehospScoring(reportId)
            : this.filterDashboardService.getFilterSettingsForRehosp(reportId);
    }

    setFilterSettingsForADLDistTrendingDetail(filterSettingsDto: FilterSettingsDto): FilterSettingsDto {
        filterSettingsDto.SelectedChartDetails.filter.FilterValue =
            this.selectedChartService.getADLDistTrendingDetailFilterValue(filterSettingsDto.SelectedChartDetails.category);
        filterSettingsDto.FilterSettings.StartDate = this.selectedChartService.getADLDistDetailDateBySeries(filterSettingsDto.SelectedChartDetails.series);
        filterSettingsDto.FilterSettings.EndDate = filterSettingsDto.FilterSettings.StartDate;
        filterSettingsDto.FilterSettings.IsDrillDown = true;
        filterSettingsDto.FilterSettings.DataFilters.push(
            this.addDataFilter(filterSettingsDto.SelectedChartDetails.filter.FilterType, filterSettingsDto.SelectedChartDetails.filter.FilterValue));
        filterSettingsDto.FilterSettings.DataFilters.push(
            this.addDataFilter(this.rtmsConstantService.filterTypes.None, filterSettingsDto.SelectedChartDetails.series));
        filterSettingsDto.DetailInfo = moment(filterSettingsDto.FilterSettings.EndDate).format('MM/DD/YYYY');
        return filterSettingsDto;
    }

    getInfectionControlDetailDashboardReportsDataFilters(dashboardControl,
      selectedChartDetails, isDetailDashboard, isReportDashboard): DataFilter[] {
        let dataFilters = [];
        if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticSurveillanceDetail').Id) {
            switch (selectedChartDetails.series.toLowerCase()) {
                case 'point prevalence':
                    dataFilters.push(
                        this.addDataFilter(this.rtmsConstantService.filterTypes.AntibioticPointPrevalence,
                            selectedChartDetails.filter.FilterValue));
                    break;
                case 'antibiotic starts':
                    dataFilters.push(
                        this.addDataFilter(this.rtmsConstantService.filterTypes.AntibioticStarts,
                            selectedChartDetails.filter.FilterValue));
                    break;
                case 'antibiotic dot':
                    dataFilters.push(
                        this.addDataFilter(this.rtmsConstantService.filterTypes.AntibioticDOT,
                            selectedChartDetails.filter.FilterValue));
                    break;
                default:
                    throw new Error(('Invalid series filter.'));
            }
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByClassPerUnit').Id
        || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('InfectionTypesPerUnit').Id) {
            dataFilters.push(
                this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByProviderDetail').Id) {
            dataFilters.push(
                this.addDataFilter(this.rtmsConstantService.filterTypes.PhysicianName,
                    selectedChartDetails.point.name));
        } else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('AntibioticOrderDetail').Id
        || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('InfectionTypeDetail').Id) {
            if (selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('AntibioticOrdersByClassPerUnit').Id
            || selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('InfectionTypesPerUnit').Id) {
                dataFilters.push(
                    this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.series));
                dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.UnitName, selectedChartDetails.filter.FilterValue));
            } else {
                dataFilters.push(
                    this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
            }
        }
        else if (dashboardControl.ReportId === this.listsStateService.getReportEnumByName('InfectionsDetails').Id
        || dashboardControl.ReportId === this.listsStateService.getReportEnumByName('HealthcarevsCommunityInfectionsPerUnit').Id) {
            if ( selectedChartDetails.reportId === this.listsStateService.getReportEnumByName('HealthcarevsCommunityInfectionsPerUnit').Id) {
                dataFilters = this.reportDatafilterStateService.getReportDataFilterForReport(selectedChartDetails.reportId);
                dataFilters.push(this.addDataFilter(this.rtmsConstantService.filterTypes.UnitName, selectedChartDetails.filter.FilterValue));    
            } 
            else{
                dataFilters.push(
                    this.addDataFilter(this.rtmsConstantService.filterTypes.InfectionType, selectedChartDetails.series));
                dataFilters.push(this.addDataFilter(selectedChartDetails.filter.FilterType, selectedChartDetails.filter.FilterValue));
            }
        }
        return dataFilters;
    }

    addDataFilter(filterType, filterValue) {
        return {
            FilterType: filterType,
            FilterValue: filterValue
        };
    }

    checkCardFilter(reportId: number): number {
        return this.cardFilterStateService.getCardFilterForReport(reportId);
    }

    isEnterpriseDashboard(): boolean {
        return this.stateService.params.category && this.stateService.params.category.includes('enterprise');
    }
}
