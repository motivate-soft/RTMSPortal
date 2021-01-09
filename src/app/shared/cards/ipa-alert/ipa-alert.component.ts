import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { GridColumn } from '../../components/rtms-grid-v2/grid-column';
import { ExportService } from '../../services/services-index';

@Component({
  selector: 'rtms-ipa-alert',
  templateUrl: './ipa-alert.component.html',
  styleUrls: ['./ipa-alert.component.scss']
})
export class IPAAlertComponent implements OnInit {
  @Input() data: any;
  @Output() rowClick = new EventEmitter<any>();


  public _gridColumns: Array<GridColumn>;

  constructor(
    private exportService: ExportService

  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.FillGridColumn();
    }
  }

  ngOnInit() {
  }

  private FillGridColumn() {
      const columns: Array<GridColumn> = [
        new GridColumn({ headerName: 'MDS Question', field: 'MDSQuestion' }),
        new GridColumn({ headerName: 'MDS Answer', field: 'MDSAnswer' }),
        new GridColumn({ headerName: 'Real Time PDPM Complete', field: 'WorksheetAnswer'/*, IsSortable: true*/ }),
        new GridColumn({ headerName: 'ARD Date', field: 'MDSDateFormatted'/*, IsSortable: true*/ }),
        new GridColumn({ headerName: 'MDS Description', field: 'MDSDescription'/*, IsSortable: true*/ })
      ];

      this._gridColumns = columns;

      this.data.options = {
        gridOptions: {}
      };
      this.data.options.gridOptions.columnDefs = columns;
      this.data.options.gridOptions.rowClickEnabled = false;

      this.data.options.gridOptions.tableId = '#pdpm_ipa_alert';
      this.data.options.gridOptions.templateid = 'pdpm_ipa_alert';
      this.data.options.gridOptions.tableClass = '';

      if (this.data['isFooterGrid']) {
        this.data.options.gridOptions.showFooterGrid = true;
      }
  }
  public onExport(type: string, exportFilter: any): void {
    this.exportService.exportReport(this.data.reportId, this.data.chartName, type, this.data.seriesData, exportFilter);
  }

}
