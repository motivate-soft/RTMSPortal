import { Injectable } from '@angular/core';
import { ChartDetail } from '../models/chart-details';
import { ReportInfo } from '../models/report-info';
import { DrillDownStateService } from 'src/app/drill-down/store/services/drill-down-state.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { list } from '../utility/list';

@Injectable()
export class SelectedChartStateService {

    constructor(private drillDownStateService: DrillDownStateService,
        private filterService: FiltersService) { }


    report: ReportInfo;

    setSelectedChartDetailsByEvent(event) {

        const point = event.point;
        if (!point) {
            this.setSelectedChartDetails(event);
        } else {
            let chartDetails: ChartDetail;
            chartDetails = {
                point: point.options,
                series: point.series.options.name,
                category: point.category,
                pointX: point.x,
                pointY: point.y,
                chartName: point.series.chart.options.name,
                filter: event.filter === undefined ? this.filterService.filterSettings.get() : event.filter,
                reportId: point.series.chart.options.reportId,
                returnsToRoute: point.series.chart.options.returnsToRoute ? point.series.chart.options.returnsToRoute : event.returnsToRoute
            };
            this.setSelectedChartDetails(chartDetails);
        }

    }

    setSelectedChartDetails(chartDetails: any): void {
        this.drillDownStateService.addDrillDownHistory(chartDetails);
    }

    getSelectedChartDetails(reportId: number = null): ChartDetail {
        const chartDetails = list(this.drillDownStateService.getDrillDownHistory())
            .FirstOrDefault(d => d.reportId === reportId || !reportId);
        if (chartDetails) {
            return chartDetails;
        } else {
            return null;
        }
    }

  public clearSelectedReport() {
    this.drillDownStateService.removeItemFromHistory(this.drillDownStateService.getDrillDownHistory().length - 1);
  }

  public getSelectedReport(): ChartDetail {
      const selectedReport = this.drillDownStateService.getDrillDownHistory()[this.drillDownStateService.getDrillDownHistory().length - 1];
      return selectedReport;
  }
}
