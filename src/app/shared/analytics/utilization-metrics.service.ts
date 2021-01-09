import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { FilterDashboardService } from '../services/portal/filter-dashboard.service';


@Injectable()
export class UtilizationMetricsService {
    constructor(
        private angulartics2: Angulartics2,
        private filtersService: FiltersService,
        private filterDashboardService: FilterDashboardService
    ) {
    }

    recordChartDrilldown(reportId, reportName, seriesName, xAxisValue, yAxisValue, drillsIntoReportId?): void {
        this.angulartics2.eventTrack.next({
            action: 'Drilldown',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    ReportName: reportName,
                    Datapoint: {
                        series: seriesName,
                        Value: {
                            x: xAxisValue,
                            y: yAxisValue
                        }
                    },
                    DrillsIntoReportId: drillsIntoReportId
                })
            },
        });
    }

    recordGridDrilldown(reportId, reportName, filter, drillsIntoReportId): void {
        this.angulartics2.eventTrack.next({
            action: 'Drilldown',
            properties: {
                category: reportId,
                label: JSON.stringify(
                    {
                        ReportId: reportId,
                        ReportName: reportName,
                        Filter: filter,
                        DrillsIntoReportId: drillsIntoReportId
                    })
            }
        });
    }

    recordTableSorting(reportId, reportName, gridColumnId, headerName, sort): void {
        this.angulartics2.eventTrack.next({
            action: 'TableSorting',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    ReportName: reportName,
                    GridColumnId: gridColumnId,
                    Header: headerName,
                    Sorting: sort
                })
            }
        });
    }
    recordFilter(): void {       
        let filterSettings = this.filtersService.filterSettings.get();
        filterSettings.OrganizationId = this.filterDashboardService.getSelectedOrganizationId();
        this.angulartics2.eventTrack.next({
            action: 'Filter',
            properties: {
                label: JSON.stringify({
                    Filter: filterSettings
                })
            }
        });
    }

    recordCardFilter(reportId, filterValue): void {
        this.angulartics2.eventTrack.next({
            action: 'CardFilter',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    Filter: filterValue
                })
            }
        });
    }

    recordResidentIndicatorClick(reportId, reportName, resMrn): void {
        this.angulartics2.eventTrack.next({
            action: 'ResidentIndicatorClick',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    ReportName: reportName,
                    ResMrn: resMrn
                })
            }
        });
    }

    recordInboxActivity(reportId, reportScheduleHistoryId): void {
        this.angulartics2.eventTrack.next({
            action: 'Inbox-activity',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    ReportScheduleHistoryId: reportScheduleHistoryId
                })
            }
        });
    }

    recordExports(reportId, reportName, exportType, filter): void {
        this.angulartics2.eventTrack.next({
            action: 'Exports',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    ReportName: reportName,
                    Format: exportType,
                    Filter: filter
                })
            }
        });
    }

    recordLandingReportClick(reportId, reportName): void {
        this.angulartics2.eventTrack.next({
            action: 'LandingReportClick',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    ReportName: reportName
                })
            }
        });
    }

    recordFullScreen(reportId, reportName): void {
        this.angulartics2.eventTrack.next({
            action: 'FullScreen',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    ReportId: reportId,
                    ReportName: reportName
                })
            }
        });
    }

    recordInActiveUserLogout(): void {
        this.angulartics2.eventTrack.next({
            action: 'InActiveUserLogout',
            properties: {
                label: 'User Logged out for inactivity.'
            }
        });
    }

    recordUserCardFlip(reportId): void {
        this.angulartics2.eventTrack.next({
            action: 'UserCardFlip',
            properties: {
                category: reportId,
                label: 'User Flipped Card in HS Dashboard Details.'
            }
        });
    }

    recordResidentChange(resMRN): void {
        this.angulartics2.eventTrack.next({
            action: 'Resident Changed',
            properties: {
                label: JSON.stringify({
                    Resident: resMRN
                })
            }
        });
    }

    recordSetIPASnoozeDate(reportId, data): void {
        this.angulartics2.eventTrack.next({
            action: data.IsSnoozed? 'Snooze IPA Alert' : 'End Snooze IPA Alert',
            properties: {
                category: reportId,
                label: JSON.stringify({
                    MDSId: data.MDSId,
                    DateFound: data.DateFound,
                    SnoozeDate: data.SnoozeDate
                })
            }
        });
    }
}
