import { Component, OnInit, Input, SimpleChanges} from '@angular/core';
import { DataWidgetConfig } from '../../models/data-widget-config';
import { GridColumn } from '../../components/rtms-grid-v2/grid-column';


@Component({
  selector: 'rtms-grid-card',
  templateUrl: './grid-card.component.html',
  styleUrls: ['./grid-card.component.scss']
})
export class GridCardComponent implements OnInit {

  constructor() { }

  @Input() chartConfig: DataWidgetConfig;
  @Input() seriesData: any[];
  @Input() data: any;
  @Input() gridOptions: any;
  @Input() allowOnClick: boolean;
  @Input() drillsIntoReportId: number;
  @Input() reportId: number;
  @Input() drilldownDestination: string;
  @Input() runOutsideAngular = true;
  public gridColumns: Array<GridColumn> = [];
  public gridData: Array<any> = [];

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gridOptions']) {
      if (this.gridOptions) {
        this.gridColumns = this.gridOptions.columnDefs;
        this.gridData = this.seriesData;
      }
    }
  }

}
