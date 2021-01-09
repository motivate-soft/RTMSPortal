import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationModel, ReportModel } from 'src/app/shared/models/models-index';
import { FileFormatEnum } from 'src/app/shared/enums/enums-index';
import { FiltersService } from '../../../filter/store/services/filters.service';
import { FileSaverService } from 'ngx-filesaver';
import { ListsStateService } from '../../../lists/store/services/lists-state.service';
import { ReportGroups } from 'src/app/shared/enums/report-group';
import { EnvService } from '../../environment/env.service';
import { ReportService } from 'src/app/shared/services/portal/report.service';
import { FilterStateService } from '../filter-state.service';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';
import { RtmsConstantService } from '../rtms-constant.service';

@Injectable()
export class ExportService {
    constructor(
        private _http: HttpClient,
        private _filtersService: FiltersService,
        private _fileSaver: FileSaverService,
        private _listsStateService: ListsStateService,
        private envService: EnvService,
        private filterStateService: FilterStateService,
        private reportService: ReportService,
        private utilizationMetricsService: UtilizationMetricsService,
        private rtmsConstantService: RtmsConstantService
    ) { }

    private exportData = [
        { 'type': 'PDF', 'header': 'application/pdf', 'extension': 'pdf', 'APIEnumValue': '0' },
        { 'type': 'EXCEL', 'header': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'extension': 'xlsx', 'APIEnumValue': '3' },
        { 'type': 'WORD', 'header': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'extension': 'docx', 'APIEnumValue': '4' },
        { 'type': 'CSV', 'header': 'application/csv', 'extension': 'csv', 'APIEnumValue': '1' },
        { 'type': 'DETAILPDF', 'header': 'application/pdf', 'extension': 'pdf', 'APIEnumValue': '5' }
    ];

    downloadScheduledReport = async (report: ReportModel, filter: any, org: OrganizationModel) => {

        return this.downloadReport(report, 'PDF', null, filter, org, 'exports/exportscheduledreport');
    }

    exportReport(reportId, chartName, type, filteredJson, exportFilter: any): void {
        this.reportService.getReportById(reportId).then(response => {
            this.utilizationMetricsService.recordExports(reportId, chartName, type, exportFilter);

            if (this._filtersService.isEnterpriseDashboard.get() === true) {
                this.exportEnterpriseReport(response, type, filteredJson, exportFilter);
            } else {
                this.downloadReport(response, type, filteredJson, exportFilter, this._filtersService.organizations.getFirstOrDefault());
            }
            return;
        });
    }

    exportEnterpriseReport(report: ReportModel, type: string, filteredJson: any, exportFilter: any) {
        let org = this._filtersService.selectedEnterpriseOrganization.get();
        if (exportFilter) {
            const facilityFilter = exportFilter.DataFilters.find(f => f.FilterType === this.rtmsConstantService.filterTypes.Facility);
            if (facilityFilter) {
                org = this._listsStateService.getUserOrganizations().find(o => o.OrganizationName === facilityFilter.FilterValue);
            } else {
                org = this._listsStateService.getUserOrganizations().find(o => o.OrganizationId === exportFilter.OrganizationId);
            }
        }
        this.downloadReport(report, type, filteredJson, exportFilter, org);
    }

    downloadReport = async (report: ReportModel, fileFormat: string, filteredJson: any, filter: any, org: OrganizationModel, apiRoute: string = '') => {

        const format = this.exportData.filter(e => e.type.includes(fileFormat.toUpperCase()))[0].APIEnumValue;

        const reportExportRequest = {
            Format: format,
            ReportType: report.ReportId,
            OrganizationId: org.OrganizationId,
            OrganizationName: org.OrganizationName,
            RequestData: filter,
            JsonData: filteredJson
        };

        if (!apiRoute || apiRoute === '') {
            apiRoute = this.getExportRoute(report.ReportGroup);
        }

        const response = await this._http.post(this.envService.api + apiRoute, reportExportRequest, { responseType: 'arraybuffer' })
            .toPromise();

        this.saveFile(response, report.ReportName, fileFormat);
    }

    saveFile = function (data, name, type) {
        const fileData = this.getExportFileData(type);
        const blob = new Blob([data], { type: fileData.header });

        const fileName = (name === undefined ? 'my-file' : this.getFileName(name)) + '.' + fileData.extension;
        this._fileSaver.save(blob, fileName);
    };

    getFileName = function (filename: string) {
        return filename + '-' + this.getTodayMMDDYYYY();
    };

    getTodayMMDDYYYY = function () {
        const today = new Date();
        let dd = today.getDate().toString();
        let mm = (today.getMonth() + 1).toString(); // January is 0!
        const yyyy = today.getFullYear().toString();
        const h = today.getHours().toString();
        const m = today.getMinutes().toString();
        const ss = today.getSeconds().toString();

        if (+dd < 10) {
            dd = '0' + dd;
        }
        if (+mm < 10) {
            mm = '0' + mm;
        }
        return mm + dd + yyyy + h + m + ss;
    };

    getExportFileData = function (exportType: string) {
        for (let i = 0; i < this.exportData.length; i++) {
            const object = this.exportData[i];

            if (exportType.toUpperCase() == object.type) {
                return object;
            }
        }
    };

    getExportRoute = (group: number): string => {
        let apiRoute = '';
        switch (group) {
            case this._listsStateService.getReportGroupByName(ReportGroups.FinancialReports).Id:
                apiRoute = 'exports/exportfinancialreport';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.ClinicalReports).Id:
                apiRoute = 'exports/exportclinicalreport';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.QMReports).Id:
                apiRoute = 'exports/exportqmreport';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.RTAReports).Id:
                apiRoute = 'exports/exportrehospreport';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.AdminReports).Id:
                apiRoute = 'exports/exportadminreport';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.HealthSystem).Id:
                apiRoute = 'exports/exporthealthsystemreport';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.CareTransitionsDashboard).Id:
            case this._listsStateService.getReportGroupByName(ReportGroups.ResidentDashboard).Id:
                apiRoute = 'exports/export-resident';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.PDPMDashboard).Id:
            case this._listsStateService.getReportGroupByName(ReportGroups.PDPMReports).Id:
                apiRoute = 'exports/export-pdpm';
                break;
            case this._listsStateService.getReportGroupByName(ReportGroups.InfectionControlReports).Id:
                apiRoute = 'exports/export';
                break;
            default:
                throw new Error('Invalid ReportGroup constant was supplied.');
        }

        return apiRoute;
    }
}
