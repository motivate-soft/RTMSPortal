import { Component, OnInit, Input, SimpleChanges} from '@angular/core';
import { BarSeriesData } from 'src/app/shared/models/bar-series-data';
import { DataWidgetConfig } from '../../models/data-widget-config';


@Component({
  selector: 'rtms-unordered-list',
  templateUrl: './unordered-list-card.component.html',
  styleUrls: ['./unordered-list-card.component.scss']
})
export class UnorderedListCardComponent implements OnInit {

  constructor() { }

  @Input() chartConfig: DataWidgetConfig;
  @Input() gridOptions: any[];
  @Input() seriesData: any[];
  @Input() allowOnClick: boolean;
  @Input() drillsIntoReportId: number;
  @Input() runOutsideAngular = true;

  data: any;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

}
