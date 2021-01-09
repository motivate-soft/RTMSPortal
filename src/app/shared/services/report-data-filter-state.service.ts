import { Injectable } from '@angular/core';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { DataFilter } from '../models/data-filter';
import { ReportDataFilter } from '../models/report-data-filter.model';
import { elementAt } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class ReportDataFilterStateService {
    constructor(private filtersService: FiltersService) { }
    public setReportDataFilter(reportId: number, dataFilters: Array<DataFilter>): void {
        if (reportId && dataFilters) {
          if (dataFilters.length > 0) {
            const reportDataFilters: Array<ReportDataFilter> = [...this.filtersService.currentDashboardDataFilters.get()];

            _.remove(reportDataFilters, (element) => element.reportId === reportId);

            const newReportDataFilter: ReportDataFilter = {
                reportId : reportId,
                dataFilters : dataFilters
              };

            reportDataFilters.push(newReportDataFilter);
            this.filtersService.currentDashboardDataFilters.set(reportDataFilters);
          }
        }
    }

    public getReportDataFilterForReport(reportId: number): Array<DataFilter> {
        const reportDataFilters: Array<ReportDataFilter> = [...this.filtersService.currentDashboardDataFilters.get()];

        const returnValue = _.find(reportDataFilters, (element) => {
            return element.reportId === reportId;
          });

        return [...returnValue.dataFilters];
    }

    public clearReportDataFilters(): void {
        this.filtersService.currentDashboardDataFilters.clear();
    }
}
