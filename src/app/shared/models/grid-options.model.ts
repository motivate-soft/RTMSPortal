import { ReportColumnDefinitionModel } from './report-column-definition.model';

export interface GridOptionsModel {
    ChartName: string;
    RowTitleEnabled: Boolean;
    columnDefs: Array<ReportColumnDefinitionModel>;
    sorttype: string;
    sortable: boolean;
    sortReverse: boolean;
    sortOverrideColumn: string;
    templateid: string;
    tableClass: string;
    pagination: Boolean;
    allowRowGrouping: Boolean;
    exportDisabled: Boolean;
    rowClickEnabled: Boolean;
    isSearchRestricted: Boolean;
    reportKey: string;
    setSortIcon: Function;
    selectedRow: number;
    isFullHeight: boolean;
    searchText: string;
    rowClick: Function;
    onSortChanged: Function;
    rowClass: Function;
    showFooterGrid: boolean;
}
