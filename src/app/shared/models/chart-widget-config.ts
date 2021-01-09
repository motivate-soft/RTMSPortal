import { DataWidgetConfig } from './data-widget-config';

export interface ChartWidgetConfig extends DataWidgetConfig {
    axis: {
        xAxis: {
            data: object;
            isDate: boolean;
            format?: string;
        };
        yAxis: {
            MaxYAxis: number;
            IsYAxisPercent: boolean;
            secondaryAxis ?: {
                enabled: boolean;
                max: Number;
                isPercentage: boolean;
                markerEnable: boolean;
            };
        };
    };
    stacking: any;
    credit: {
        text: string,
        align: 'left' | 'right' | 'center',
        enabled: boolean
    };
    blockSelectedPointColor: boolean;
    showLegend: boolean;
    isHalfDonut: boolean;
    showInLegend: boolean;
    showInDatalabels: boolean;
    colorPalette: Array<string>;
    size: string;
    colorByPoint: boolean;
}
