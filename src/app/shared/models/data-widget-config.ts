export interface DataWidgetConfig {
    ReportId: number;
    name: string;
    HasData: boolean;
    disableExport: boolean;
    isMarketingMode: boolean;
    DrillsIntoReportId: number;
    tooltipFormat?: string;
    dataLabels: {
        show: boolean;
        formatter: string;
    };
    chartType: string;
    FilterType: string;
}
