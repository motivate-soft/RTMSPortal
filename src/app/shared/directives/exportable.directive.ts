import { Directive, Input } from '@angular/core';
import { ExportService, FilterStateService, ReportService } from '../services/services-index';
import { UtilizationMetricsService } from '../analytics/utilization-metrics.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';

@Directive({
    selector: '[exportable]'
})
export class ExportableDirective {

    @Input() data: any;

    constructor(private exportService: ExportService,
        private filterStateService: FilterStateService,
        private reportService: ReportService,
        private utilizationMetricsService: UtilizationMetricsService,
        private filtersService: FiltersService) { }

    public export(type: string, exportFilter: any): void {
        this.reportService.getReportById(this.data.reportId).then(response => {
            this.utilizationMetricsService.recordExports(this.data.reportId, this.data.chartName, type, exportFilter);

            if (this.filtersService.isEnterpriseDashboard.get() === true) {
                this.exportService.exportEnterpriseReport(response, type, null, exportFilter);
            } else {
                this.exportService.downloadReport(response, type, null, exportFilter, this.filtersService.organizations.getFirstOrDefault());
            }
            return;
        });
    }
}
