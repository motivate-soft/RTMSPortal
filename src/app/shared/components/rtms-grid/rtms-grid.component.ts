import { Component, Input, Output, SimpleChanges, ViewChild, ElementRef, OnChanges, EventEmitter, OnInit } from '@angular/core';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { RtmsGridOptionsModel } from 'src/app/shared/models/rtms-grid-options.model';
import { ReportColumnDefinitionModel } from 'src/app/shared/models/report-column-definition.model';
import {
  PagingService,
  TableHeaderService,
  ExportService
} from 'src/app/shared/services/services-index';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import * as _ from 'lodash';
import { FiltersService } from 'src/app/filter/store/services/filters.service';

declare var $: any;

@Component({
  selector: 'rtms-grid',
  templateUrl: './rtms-grid.component.html',
  styleUrls: ['./rtms-grid.component.scss']
})
export class RtmsGridComponent implements OnInit, OnChanges {

  constructor(private exportService: ExportService,
    private utilizationMetricsService: UtilizationMetricsService,
    private pagingService: PagingService,
    private tableHeaderService: TableHeaderService,
    private listsStateService: ListsStateService,
    private filtersService: FiltersService
  ) { }

  @Input() rowData = [];
  @Input() options: RtmsGridOptionsModel;
  @Input() showSearch = true;
  @Input() reportId: number;
  @Input() allowScrollSelectedRow: boolean;
  @Input() noDataMessage: string;
  @Input() hideFooter = false;
  @Output() rowClick = new EventEmitter();
  @Output() gridCellDrillDown = new EventEmitter();
  public data = [];
  public columns = [];
  public columnDefs: Array<ReportColumnDefinitionModel> = [];
  public subChildColumns = [];
  public gridOptions: any;
  public globalFilterColumns = [];
  public ItemsByPage = [];
  public currentPage = 0;
  showExpandCollapseForAdlVsMds = false;
  showPDPMSummaryFooterMsg = false;
  isAllExpanded = false;
  userWasFiltered = false;
  isShowTooltip = false;
  disableFixHeader = false;
  headerLevel = 1;

  public defaultOptions = {
    gridOptions: {

      exportDisabled: false,
      // For global sorting default value sortable = true
      sortable: true,

      // Assign class for sort icon
      setSortIcon(sortType): string {
        return sortType ? 'fa fa-sort-desc' : 'fa fa-sort-asc';
      },

      // For sort order default sort order = Asc and sortReverse = false
      sortReverse: true,

      // Default selected row index
      selectedRow: null,

      // set class according to this bit
      isFullHeight: true,
      searchText: '',

      // global bit that enable/disable Row grouping
      allowRowGrouping: true,

      // global bit for pagination default value = true
      pagination: false,

      rowClickEnabled: true,
      sortOverrideColumn: '',
    }
  };
  private search: ElementRef;
  @ViewChild('search', { static: false }) set content(content: ElementRef) {
    this.search = content;
    if (this.gridOptions !== undefined) {
      if (this.search !== undefined) {
        fromEvent(this.search.nativeElement, 'keyup')
          .pipe(debounceTime(200), distinctUntilChanged())
          .subscribe((text: string) => this.onFilterChanged());
      }
    }
  }

  ngOnInit() {
    this.showExpandCollapseForAdlVsMds = this.listsStateService.getReportEnumByName('ADLvsMDSScoreRollup').Id === this.reportId;
    this.isShowTooltip = this.listsStateService.getReportEnumByName('ADLvsMDSScoreDetail').Id === this.reportId;
    this.showPDPMSummaryFooterMsg = this.listsStateService.getReportEnumByName('PDPMSummary').Id === this.reportId ||
      this.listsStateService.getReportEnumByName('PDPMSummaryDetail').Id === this.reportId;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['options']) {
      if (this.options) {
        this.loadGrid();
      }
    }
    if (changes['rowData']) {
      if (this.rowData) {
        if (this.rowData && this.rowData.length && !this.rowData[0].RowId) {
          this.rowData.forEach((item, idx) => {
            item.__trackingId = (idx + 1);
          });
        }

        this.data = this.rowData;
        if (this.gridOptions) {
          const sortOptions = this.gridOptions.sorttype && this.gridOptions.sorttype.split('|').map(s => s.trim());
          const sortOptionsSortType = sortOptions && sortOptions.length ? sortOptions[0] : this.options.gridOptions.sorttype;
          const column = this.options.gridOptions.columnDefs.find(f => f.field === sortOptionsSortType);
          if (sortOptions && sortOptions.length > 1) {
            // we're using the NOT operator because the subsequent call to onSortChanged will change the value of sortReverse
            this.gridOptions.sortReverse = !(sortOptions[1] === '0');
          }
          if (column) {
            this.gridOptions.sortType = sortOptionsSortType;
            this.onSortChanged(column);
          }
          this.refreshData(this.rowData);
          this.gridOptions.searchText = '';
          this.isAllExpanded = false;
          setTimeout(() => {
            if (this.allowScrollSelectedRow === undefined || this.allowScrollSelectedRow) {
              if (this.options.api.scrollSelectedRowToView) {
                this.options.api.scrollSelectedRowToView(0, this);
              }
            }
          });
        }
      }
    }
  }

  public scrollSelectedRowToView(rowNum, self): void {
    if (self.options.gridOptions.selectedRow && self.options.gridOptions.selectedRow !== null) {
      rowNum = self.options.gridOptions.selectedRow;
    }

    if (rowNum) {
      const selectedRow = $('[data-rowid=\'row-' + rowNum + '\']');
      if (!self.isRowVisible(selectedRow)) {
        if (selectedRow[0]) {
          const $selectedRow = $(selectedRow) as any;
          $selectedRow.scrollintoview();
        }
      }
    }
  }

  public loadGrid() {
    this.options.api = {};

    this.options.api.scrollSelectedRowToView = this.scrollSelectedRowToView;
    this.validateOptions();
    this.options.gridOptions = { ...this.defaultOptions.gridOptions, ...this.options.gridOptions };
    this.gridOptions = this.options.gridOptions;
    if (this.gridOptions.showFooterGrid) {
      this.gridOptions.tableClass = this.gridOptions.tableClass && this.gridOptions.tableClass.includes('financialdetail_tablemds') ? this.gridOptions.tableClass :
        ('financialdetail_tablemds ' + this.gridOptions.tableClass);
    }

    // Compute the child of each column into a flat array.
    this.columns = [];
    this.columnDefs = [];
    this.subChildColumns = [];

    if (this.gridOptions !== null && this.gridOptions.columnDefs && this.gridOptions.columnDefs.length > 0) {
      this.gridOptions.columnDefs.forEach(column => {
        if (column.children) {
          this.headerLevel = 2;
          column.children.forEach(child => {
            this.columns.push({ parent: column, child: child });
            if (child.children) {
              this.headerLevel = 3;
              child.children.forEach(subChild => {
                this.subChildColumns.push({ parent: column, subChild: subChild });
                this.columnDefs.push(subChild);
              });
            } else {
              this.columnDefs.push(child);
            }
          });
        } else {
          this.columns.push({ parent: column });
          this.columnDefs.push(column);
        }
      });
    }
    this.globalFilterColumns = [];

    this.columnDefs.forEach(col => {
      if (col.field && col.field !== '' && col.isSearchable) {
        this.globalFilterColumns.push(col.field);
      }
    });
    if (!this.disableFixHeader) {
      this.tableHeaderService.handleFitTableHead(this.gridOptions.tableId);
    }
  }

  public getColspan(column): number {
    let colspan = 1;
    if (column.children) {
      colspan = 0;
      column.children.forEach(function (child) {
        colspan = colspan + (child.children ? child.children.length : 0);
      });
      if (colspan < column.children.length) {
        colspan = column.children.length;
      }
    }
    return colspan;
  }

  public validateOptions(): void {
    if (!this.options) {
      console.error('options must be specified for rtmsgrid.');
      return;
    }

    if (!this.options.gridOptions) {
      console.error('options.gridOptions must be specified for rtmsgrid.');
      return;
    }
  }

  public isRowVisible($el): any {
    return ($el && $el.position() && $el.position().top > 0 && $el.position().top < $el.closest('.fh-report-table-content').height());
  }

  public onRowClick(event: any, datam: any, index: number): void {
    if (event.target.classList.contains('residentIndicator') || event.target.classList.contains('deatilButton')
      || event.target.classList.contains('snooze')) {
      return;
    }

    if (this.gridOptions.drillDownGridId || this.gridOptions.detailDashboardId || this.gridOptions.rowClickEnabled) {
      this.rowClick.emit({
        selItem: datam, index: index, reportId: this.reportId, sortType: this.gridOptions.sortType,
        sortReverse: !this.gridOptions.sortReverse
      });
      setTimeout(() => {
        this.options.api.scrollSelectedRowToView(index, this);
      }, 2000);
    }
  }

  cellClick(col: any, datam: any) {
    if (col.field === 'Numerator') {
      if (datam.Numerator > 0) {
        this.filtersService.isQMNumerator.set(true);
        this.filtersService.isQMDenominator.set(false);
        this.gridCellDrillDown.emit({ data: datam, denominator: false, reportId: this.reportId, column: col });
      }
    } else if (col.field === 'Denominator') {
      if (datam.Denominator > 0) {
        this.filtersService.isQMNumerator.set(false);
        this.filtersService.isQMDenominator.set(true);
        this.gridCellDrillDown.emit({ data: datam, denominator: true, reportId: this.reportId, column: col });
      }
    } else {
      this.gridCellDrillDown.emit({ data: datam, reportId: this.reportId, column: col });
    }
  }

  public onSortChanged(column: any): void {
    if (!this.gridOptions.sortable || column.suppressSort) {
      return;
    }

    this.gridOptions.sortReverse = this.gridOptions.sortType === column.field && this.gridOptions.sortReverse !== undefined ? !this.gridOptions.sortReverse : false;

    const sorting = !this.gridOptions.sortReverse ? 'asc' : 'desc';
    this.utilizationMetricsService.recordTableSorting(this.reportId, this.options.gridOptions.ChartName, column.GridColumnsId,
      column.headerName, sorting);

    this.gridOptions.sortType = column.field;
    if (column.customSortColumn && column.customSortColumn !== '') {
      this.gridOptions.sortOverrideColumn = column.customSortColumn;
    } else {
      this.gridOptions.sortOverrideColumn = this.gridOptions.sortType;
    }

    this.refreshData(this.filterData(this.data, this.gridOptions.searchText));
  }

  public onFilterChanged(): void {
    if (this.gridOptions) {
      let filteredData = [];

      if (this.gridOptions.isSearchRestricted && this.globalFilterColumns.length > 0) {
        let found;
        filteredData = this.rowData.filter(function (item) {
          found = false;
          this.globalFilterColumns.forEach(function (column) {
            if (item[column.field].toString().toLowerCase().indexOf(this.gridOptions.searchText.toLowerCase()) !== -1) {
              found = true;
            }
          });
          return found;
        });
      } else {
        filteredData = this.filterData(this.rowData, this.gridOptions.searchText);
      }
      this.refreshData(filteredData);
    }
  }

  filterData(data, searchText): any {
    return data.filter(obj =>
      Object.keys(obj).some(k => {
        return ('' + obj[k]).toLowerCase().includes(searchText.toLowerCase());
      })
    );
  }

  sortData(data) {
    let sortingConfig: Array<{
      field: string,
      direction: 'asc' | 'desc'
    }> = [];
    // Add primary sort columns
    if (this.gridOptions.primarySortByColumns) {
      this.gridOptions.primarySortByColumns.forEach(column => {
        let sortReverse = false;
        let sortColumn = column;
        if (column.indexOf('!') != -1) {
          sortReverse = true;
          sortColumn = sortColumn.replace('!', '');
        }
        sortingConfig.push({
          field: sortColumn,
          direction: sortReverse ? 'desc' : 'asc'
        });
      });
    }
    // Add clicked or default sort column
    if (this.gridOptions.sortOverrideColumn) {
      sortingConfig.push({
        field: this.gridOptions.sortOverrideColumn,
        direction: this.gridOptions.sortReverse ? 'desc' : 'asc'
      });
    }

    return this.pagingService.sortData(data, sortingConfig);
  }

  refreshData(data) {
    if (this.gridOptions !== undefined) {
      data = this.sortData(data);

      if (this.gridOptions.pagination) {
        this.pagination(data);
      } else {
        this.data = data;
        this.gridOptions.searchQuery = this.gridOptions.searchText;
      }
      if (!this.disableFixHeader) {
        setTimeout(() => {
          this.tableHeaderService.handleFitTableHead(this.gridOptions.tableId);
        }, 2000);
      }
    }
  }

  // Pagination code starts
  lastPage(): void {
    if (this.currentPage < this.ItemsByPage.length - 1) {
      // loadingService.showLoader();
      setTimeout(() => {
        this.currentPage = this.pagingService.lastPage(this.ItemsByPage);
        // loadingService.hideLoader();
      });
    }
  }

  firstPage(): void {
    if (this.currentPage > 0) {
      // loadingService.showLoader();
      setTimeout(() => {
        this.currentPage = this.pagingService.firstPage();
        // loadingService.hideLoader();
      });
    }
  }

  setPage(page): void {
    if (page < this.ItemsByPage.length && page >= 0) {
      // loadingService.showLoader();
      setTimeout(() => {
        this.currentPage = this.pagingService.setPage(page, this.ItemsByPage);
        // loadingService.hideLoader();
      });
    }
  }

  pagination(data, pageSize = 0): void {
    this.ItemsByPage = this.pagingService.pagination(data, pageSize);
    if (this.currentPage > this.ItemsByPage.length - 1) {
      this.firstPage();
    }
  }
  // Pagination code ends

  getRowId(index): string {
    return 'row-' + index;
  }

  public onExport(type: string, exportFilter: any): void {
    let filteredJson = null;

    if (this.gridOptions.searchText || this.gridOptions.sortOverrideColumn) {
      filteredJson = this.sortData(this.filterData(this.data, this.gridOptions.searchText));
    } else {
      filteredJson = this.data;
    }
    this.exportService.exportReport(this.reportId, this.gridOptions.ChartName, type, filteredJson, exportFilter);
  }

  toggleExpandCollapseForAdlVsMds() {
    if (this.showExpandCollapseForAdlVsMds) {
      const isAnyRowCollapsed = _.some(this.data, (d) => {
        return !d.ShowDetail;
      });
      this.isAllExpanded = !isAnyRowCollapsed;
    }
  }

  showAdlVsMdsRollupDetail() {
    this.isAllExpanded = !this.isAllExpanded;
    this.userWasFiltered = true;
    this.data.forEach(d => {
      d.ShowDetail = this.isAllExpanded;
    });
    this.refreshData(this.data);
  }

  trackByRowIdOrIndex = (index, item) => {
    return item.RowId || item.__trackingId;
  }

  trackByIndex(index, item) {
    return index;
  }

  trackByGridColumnId(index, item) {
    return item.child ? item.child.GridColumnsId :
      item.parent ? item.parent.GridColumnsId :
        item.GridColumnsId;
  }

  checkForNull(value) {
    return value == null ? '' : value;
  }
}
