import { SeriesData } from './series-data';
import { CardDataLabelConfig } from './card-data-label-config';

export interface BarSeriesData extends SeriesData {
    key: string;
    showInLegend: boolean;
    color: string;
    dataLabels?: CardDataLabelConfig;
    yAxis: number;
}
