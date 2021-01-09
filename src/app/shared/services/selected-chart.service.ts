import { Injectable } from '@angular/core';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { FilterDashboardService } from './portal/filter-dashboard.service';
import * as moment from 'moment';

@Injectable()
export class SelectedChartService {
    constructor(private listsStateService: ListsStateService,
        private filterDashboardService: FilterDashboardService) {

    }

    getSelectedChartDetailDate(chartData): string {
        if (chartData.chartName === this.listsStateService.getReportEnumByName('AverageADLScoresChart').Name) {
            return moment(chartData.category).format('MM/DD/YYYY');
        }
    }

    getADLDistDetailDateBySeries(seriesName) {
        return this.getADLDistDetailDate(seriesName, this.filterDashboardService.getFilterSettings().EndDate);
    }

    getADLDistDetailDate(seriesName, date) {

        let StartDate;
        if (seriesName === '30 Days Prior') {
            StartDate = moment(date).subtract(30, 'days');
        } else if (seriesName === '7 Days Prior') {
            StartDate = moment(date).subtract(7, 'days');
        } else {
            StartDate = moment(seriesName);
        }
        return StartDate;
    }

    getADLDistTrendingDetailFilterValue(value): string {
        let filterType;
        if (value === 'A (0-5)') {
            filterType = 'A';
        } else if (value === 'B (6-10)') {
            filterType = 'B';
        } else if (value === 'C (11-16)') {
            filterType = 'C';
        }
        return filterType;
    }
}
