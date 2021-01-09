import { DataFilter } from './data-filter';

export interface ReportDataFilter {
    reportId: number;
    dataFilters: Array<DataFilter>;
  }
