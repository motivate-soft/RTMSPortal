import { FilterSettings } from './filter-settings';
import { ChartDetail } from './chart-details';

export class FilterSettingsDto {
    FilterSettings: FilterSettings;
    DetailInfo: string;
    SelectedChartDetails: ChartDetail;
    QMTypes: string;
}