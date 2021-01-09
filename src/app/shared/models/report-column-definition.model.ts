export interface ReportColumnDefinitionModel {
    GridColumnsId: Number;
    ParentColumnId?: Number;
    ColumnOrder: Number;
    headerName: string;
    field: string;
    suppressWordWrap: string;
    width: string;
    cellClass: string;
    hasChildren: Boolean;
    children: Array<ReportColumnDefinitionModel>;
    columnTemplate: string;
    childClass: string;
    isSearchable?: Boolean;
    customSortColumn: string;
}
