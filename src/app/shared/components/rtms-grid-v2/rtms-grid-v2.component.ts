import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, Pipe, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { GridColumn } from './grid-column';
import { GridColumnTypes } from './grid-column-types';
import { GridInfo } from '../../models/grid-info.model';
import * as _ from 'lodash';
import { GridFilterPipe } from '../../pipes';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';
import { ReportService, UtilityService, FilterStateService } from '../../services/services-index';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { StateService } from '@uirouter/core';
import { SelectedChartStateService } from '../../services/selected-chart-state.service';
import { ChartDetail } from '../../models/chart-details';

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({
  name: 'gridFilter',
  pure: false
})
@Component({
  selector: 'rtms-grid-v2',
  templateUrl: './rtms-grid-v2.component.html',
  styleUrls: ['./rtms-grid-v2.component.scss']
})
export class RtmsGridV2Component implements OnInit {

  constructor
  (
    private stateService: StateService,
    private selectedChartStateService: SelectedChartStateService,
    private filterStateService: FilterStateService,
    private utilityService: UtilityService,
    private reportService: ReportService,
    private utilizationMetricsService: UtilizationMetricsService,
    private gridFilterPipe: GridFilterPipe,
    private filtersService: FiltersService,
    private modalService: NgbModal) {

  }

  @Input() columns: Array<GridColumn> = [];
  @Input() data: Array<any> = [];
  @Input() drillsIntoReportId = 0;
  @Input() drilldownDestination: string;
  @Input() reportId = 0;
  @Input() totalRecords = 0;
  @Input() showSearch = true;
  @Input() tableClass = 'rtms-grid-table';
  @Output('onPaginationChange') onPaginationChange = new EventEmitter();
  @ViewChild('PDPMAlertModal', {static: false}) public PDPMAlertModal: TemplateRef<any>;

  public gridColumnTypes = GridColumnTypes;
  public filteredData: Array<any>;
  public _currentModalObject: any;
  private _report: any;

  color = 'accent';
  checked = false;
  disabled = false;
  public context = {
    PageNumber: 1,
    PageSize: 20,
    Filter: '',
    SortProperty: '',
    SortDirection: 'Desc'
  } as GridInfo;
  j: JSON;

  private onFilterChanged = _.debounce((config) => {
      this.onTableChanged();

      if (this.context.Filter === '') {
          this.clearRecords();
      }

  }, 500);

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.resizeHeaders();
  }

  protected getPropertyValue(data: any, propertyName: string): any {
    return data[propertyName];
  }

  public displaySearch(): boolean {
    return this.showSearch; // && (this.data && this.data.length === 0);
  }

  private onTableChanged() {
    this.onPaginationChange.emit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
  }

  resizeHeaders() {
    setTimeout(() => {
      for (const column of this.columns) {
        if (! column) {
          continue;
        }
        const cellWidth = $('#td_' + column.field + '_0').width();
        $('#th_' + column.field).width(cellWidth);
      }
    }, 250);
  }

  private onSortChanged(column: GridColumn) {
    if (this.context.SortProperty !== column.field) {
      this.context.SortDirection = 'Asc';
    } else {
      this.context.SortDirection = (this.context.SortDirection === 'Asc') ? 'Desc' : 'Asc';
    }

    this.context.SortProperty = column.field;

    this.filteredData = this.gridFilterPipe.transform(this.data, this.columns, ' ');
    this.filteredData.sort(this.dynamicSort(this.context.SortProperty, this.context.SortDirection));

  }

  onSearchChange(searchValue: string ) {
    this.filteredData = this.gridFilterPipe.transform(this.data, this.columns, searchValue);
    this.filteredData.sort(this.dynamicSort(this.context.SortProperty, this.context.SortDirection));
    this.resizeHeaders();
  }

  private clearRecords(): void {
    this.data = null;
    this.totalRecords = 0;
  }

  public showNoDataMessage(): boolean {
    return this.totalRecords === 0;
  }

  public drillDown(row): void {

    if (this.drillsIntoReportId > 0) {
      this.reportService.getReportById(this.reportId)
      .then((report) => {
        this._report = report;
        this.utilizationMetricsService.recordGridDrilldown(this._report.ReportId, this._report.ReportName,
          this.filtersService.filterSettings.get(), this.drillsIntoReportId);

          this.reportService.getReportById(this.drillsIntoReportId)
            .then((drilldownReport) => {
                const filterSettings = this.filterStateService.getFilter();
                filterSettings.MDSId = row.MDSId;

                const details = {
                  report: this._report.ChartName,
                  filter: filterSettings,
                  reportId: this._report.ReportId,
                  chartName: this._report.ChartName
                } as ChartDetail;

                this.selectedChartStateService.setSelectedChartDetails(details);

                this.stateService.transitionTo(this.drilldownDestination,
                    { report: this.utilityService.getRouteFromReportName(drilldownReport.ReportName),
                      reportId: drilldownReport.ReportId,
                      dashboardId: 500,
                      category: 'ipa-alert-details' + row.MDSId });
            });
      });
    }
  }

  public renderModal(row): void {
    this._currentModalObject = row;
    this.modalService.open(this.PDPMAlertModal, { windowClass: 'modal-danger' });
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['data']) {
      this.totalRecords = this.data.length;
      this.filteredData = this.data;
    }
  }

  private setSortIcon (sortType): string {
    return sortType === 'Desc' ? 'fa fa-sort-desc' : 'fa fa-sort-asc';
  }

  private IsLinkColumn(data: GridColumn): Boolean {
      if (data.Type === GridColumnTypes.LinkColumn || data.Type === GridColumnTypes.EditColumn
        || data.Type === GridColumnTypes.DeleteColumn) {
          return true;
      } else {
          return false;
      }
  }

  private dynamicSort(property, direction): any {
    const sortOrder = direction === 'Asc' ? 1 : -1;

    return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
  }
}
