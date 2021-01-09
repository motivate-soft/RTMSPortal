import { Component, Input, EventEmitter, Output, SimpleChanges, ContentChild, OnChanges } from '@angular/core';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { CardFilterStateService } from '../../services/card-filter-state.service';
import { ExportableDirective } from 'src/app/shared/directives/exportable.directive';
import { StateService } from '@uirouter/core';
import { ChartWrapperComponent } from 'src/app/pages';
import { DrillDownStateService } from 'src/app/drill-down/store/services/drill-down-state.service';
import { SelectedChartStateService } from '../../services/selected-chart-state.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { ChartDetail } from '../../models/chart-details';

@Component({
  selector: 'rtms-card',
  templateUrl: './rtms-card.component.html',
  styleUrls: ['./rtms-card.component.scss']
})
export class RtmsCardComponent {

  @Input() cardType: string;
  @Input() chartName: string;
  @Input() isHeaderClickable: boolean;
  @Input() tableData = [];
  @Input() reportId: number;
  @Input() filterOptions = [];
  @Input() hasData: boolean;
  @Input() exportDisabled: boolean;
  @Input() templateId: string;
  @Input() embedChart: boolean;
  @Input() showFullScreen: boolean;
  @Input() drilldownReport: string;
  @Input() drilldownDestination: string;
  @Input() isShortCard: boolean;
  @Input() showResetDetailsIcon: boolean;
  @Input() showSearch: boolean;
  @Input() detailInfo: any;
  @Input() autoHeight: boolean;
  @Input() drilldownId: number;
  @Input() hasCitation: boolean;
  @Output() export = new EventEmitter<any>();
  @Output() cardFlipped = new EventEmitter<number>();
  @Output() resetCardDetails = new EventEmitter();
  @Input() flipCard = false;
  @Input() exportFilter: any;

  public selectedOption: any = {};

  @Input() noDataMessage = '';

  constructor(private stateService: StateService,
    private drillDownStateService: DrillDownStateService,
    private selectedChartStateService: SelectedChartStateService,
    private filtersService: FiltersService,
    private listsStateService: ListsStateService) {}

  @ContentChild(ExportableDirective, {static: false}) exportableContent;
  @ContentChild(ChartWrapperComponent, {static: false}) chartWrapperComponent;

  public onHeaderClick(): void {
    const routeURL = 'genericDashboard/' + this.listsStateService.getDashboardIdByNameAndCategory
     (this.stateService.params.dashboardName, this.stateService.params.category);
    this.selectedChartStateService.setSelectedChartDetails({
      reportId:  this.reportId,
      chartName: this.chartName,
      filter: this.filtersService.filterSettings.get(),
      returnsToRoute: routeURL
    }as ChartDetail);

    const dashboard = this.listsStateService.getDashboardById(this.drilldownId);
    this.stateService.go(this.drilldownDestination,
      { report: this.drilldownReport , dashboardName : dashboard.DashboardRoute, category : dashboard.Category });
  }

  public onExport(type: string): void {
    if (this.cardType === 'grid' || this.cardType === 'ipaAlert' || this.cardType === 'pdpmWorksheet') {
      this.chartWrapperComponent.onExport(type, this.exportFilter);
    } else {
    this.exportableContent.export(type, this.exportFilter);
    }
  }

  public executeFlip(): void {
    this.cardFlipped.emit(this.reportId);
  }

  getDetailInfoClass(): string {
    return this.chartName ? 'col-md-5 col-sm-5 col-xs-5' : 'col-md-12 col-sm-12 col-xs-12';
}
}
