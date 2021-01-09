import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { NumberWidgetOptions } from 'src/app/shared/models/number-widget-options';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { StateService } from '@uirouter/core';
import * as moment from 'moment';
import { FilterSettings } from 'src/app/shared/models/filter-settings';
import { SelectedChartStateService } from 'src/app/shared/services/selected-chart-state.service';
import { FilterStateService } from 'src/app/shared/services/filter-state.service';
import { ReportService } from 'src/app/shared/services/portal/report.service';
import { NumberWidgetItem } from '../../models/number-widget-item';
import { UINotifierService, UtilityService } from '../../services/services-index';
import { UIEventTypes } from '../../enums/ui-event-types';
import { filter } from 'rxjs/operators';
import { FiltersService } from '../../../filter/store/services/filters.service';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { BaseComponent, ResidentVitalsByCategoryComponent } from '../../components';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';

@Component({
    selector: 'rtms-quilt',
    templateUrl: './quilt.component.html',
    styleUrls: ['./quilt.component.scss']
})
export class QuiltComponent extends BaseComponent implements OnChanges {


    constructor(private utilizationMetricsService: UtilizationMetricsService,
        private stateService: StateService,
        private selectedChartStateService: SelectedChartStateService,
        private filterStateService: FilterStateService,
        private reportService: ReportService,
        private filtersService: FiltersService,
        private userStateService: UserStateService,
        private utilityService: UtilityService,
        private uiNotifierService: UINotifierService,
        private listsStateService: ListsStateService

    ) {
        super();
        this.defaultOptions = {
            hasValueProp: 'HasValue',
            size: 'medium'
        };

        this.subscriptions.push(this.uiNotifierService.getUIEvents().
            pipe(filter((notificationData: PortalUIEvent) =>
                notificationData && notificationData.type === UIEventTypes.FullScreen))
            .subscribe(event => {
                this.fullscreenToggle(event.value.toggle, event.value.templateId);
            }));
    }

    @Input() options: NumberWidgetOptions;
    @Input() reportId: number;
    @Input() drilldownReport: string;
    @Input() drillsIntoReportId: number;
    @Input() drilldownDestination: string;
    @Input() data: Array<NumberWidgetItem> = [];
    @Input() allowOnClick: boolean;
    @Input() templateId: string;
    @Input() filterType: string;
    @Output() onNumberWidgetClick = new EventEmitter<any>();
    @ViewChild('residentVitalByCategoryComponent', {static: false}) residentVitalByCategoryComponent: ResidentVitalsByCategoryComponent;

    public numberWidgetClass;
    public isFullScreen = false;

    dataGroupings: any[];
    numberOfRows: number;
    defaultOptions: NumberWidgetOptions;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['options']) {
            if (this.options) {
                this.options = { ...this.defaultOptions, ...this.options };
                this.setWidgetClass(this.options.noOfCardsInRow);
            }
        }

        this.numberOfRows = 1;
        let currentRowNumber = 0;
        let currentCell = 1;

        let dataGrouping = [];
        this.dataGroupings = Array(Math.ceil(this.data.length / this.options.noOfCardsInRow));

        for (let i = 0; i < this.data.length; i++) {
          dataGrouping.push(this.data[i]);

          if (currentCell >= this.options.noOfCardsInRow || i === this.data.length - 1) {
            this.dataGroupings[currentRowNumber] = dataGrouping;
            dataGrouping = [];
            currentRowNumber ++;
            currentCell = 1;
          } else {
            currentCell ++;
          }
        }

    }

    getStyle(item): any {
      const style = {
          'max-width': this.options.height
      };

      if ((item.HasValue || item[this.options.hasValueProp]) && this.allowOnClick) {
          style['cursor'] = 'pointer';
      } else {
          style['cursor'] = 'default';

      }
      if (this.options.colorProp && item[this.options.colorProp]) {
          style['border-color'] = item[this.options.colorProp];
      }
      return style;
  }

    getDrillDown(range): void {
      this.utilizationMetricsService.recordChartDrilldown(this.reportId, this.drilldownReport,
          range.ItemName,
          range.ItemName,
          range.Value,
          this.drillsIntoReportId);

      let details;
      let filterSettings: FilterSettings;
      const filterSettingsStoreData = this.filtersService.filterSettings.get();

      filterSettings = {
          Organization: this.filtersService.organizations.getFirstOrDefault(),
          StartDate: moment(filterSettingsStoreData.StartDate).toDate(),
          EndDate: moment(filterSettingsStoreData.EndDate).toDate(),
          Units: this.filtersService.getUnitIdCSV(),
          FilterType: this.filterType,
          FilterValue: range.ItemName,
          UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
          Payers: this.filtersService.getPayersIdCSV(),
          DetailInfo: moment(filterSettingsStoreData.EndDate).format('MM/DD/YYYY'),
          DayRange: 0,
          OrganizationIds: this.filtersService.organizations.getFirstOrDefault().OrganizationId,
          RangeFilter: range.RangeId,
          QMTypeID: null,
          QMTypeIDs: this.filtersService.getQmTypeIdCSV()
      };

      details = {
          chartName: this.drilldownReport,
          filter: filterSettings,
          reportId: this.reportId,
          drillsIntoReportId: this.drillsIntoReportId
      };

      if (this.stateService.current.name === 'home.residentDashboard') {
          let filterSettingsValue: FilterSettings;
          filterSettingsValue = {
              OrganizationId: Number(filterSettingsStoreData.OrganizationId),
              ResMrn: filterSettingsStoreData.ResMRN,
              UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
              FilterValue: details.filter.FilterValue,
              FilterType: 'Vitals',
              ReportId: this.reportId,
              Category: 'Vitals'
          } as FilterSettings;
          this.residentVitalByCategoryComponent.showVitalDetails(filterSettingsValue);
      } else {
          this.selectedChartStateService.setSelectedChartDetails(details);
          this.onNumberWidgetClick.emit(details);
      }

      if (this.data.indexOf(range) !== -1 && this.options.selectedItem) {
          this.options.selectedItem.value = range.ItemName;
      }
  }

    setWidgetClass(noOfCardsInRow: number): void {
        this.numberWidgetClass = [];

        if (noOfCardsInRow > 0) {
            const bsColumn = 12 / noOfCardsInRow;
            this.numberWidgetClass.push(noOfCardsInRow <= 12 ? ('col-md-' + bsColumn + ' col-xs-' + bsColumn) : '');
            this.numberWidgetClass.push(this.options.size);
        }
    }

    arrayOne(n: number): any[] {
      return Array(n);
    }

    fullscreenToggle(isFullscreen, templateId): void {
        this.isFullScreen = isFullscreen;
    }
}
