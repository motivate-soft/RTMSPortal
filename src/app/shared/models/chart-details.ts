import { FilterSettings } from './filter-settings';

export class ChartDetail {
    point?: string;
    series?: string;
    category?: string;
    pointX?: string;
    pointY?: string;
    chartName: string;
    filter: FilterSettings;
    reportId: number;
    returnsToRoute?: string;
    selectedGridRow?: number;
    blockSelectedPointColor?: boolean;
    sortableGridColumn?: string;
    sortableGridColumnReverse?: boolean;


    constructor() {

        this.point = '';
        this.series = '';
        this.category = '';
        this.pointX = '';
        this.pointY = '';
        this.chartName = '';
        this.filter = {} as FilterSettings ;
        this.returnsToRoute = '';
    }
}
