import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FiltersService } from '../../../filter/store/services/filters.service';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { BaseComponent, ResidentVitalsByCategoryComponent } from '../../components';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { DashboardDataService } from '../../services/portal/dashboardData.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { GridColumn } from '../../components/rtms-grid-v2/grid-column';
import { ChartDetail } from '../../models/chart-details';

@Component({
    selector: 'rtms-number-widget',
    templateUrl: './number-widget.component.html',
    styleUrls: ['./number-widget.component.scss']
})
export class NumberWidgetComponent extends BaseComponent implements OnChanges {


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

    defaultOptions: NumberWidgetOptions;


    ngOnChanges(changes: SimpleChanges) {
        if (changes['options']) {
            if (this.options) {
                this.options = { ...this.defaultOptions, ...this.options };
                this.setWidgetClass(this.options.noOfCardsInRow);
            }
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

    getDrillDown(range): void {

        this.utilizationMetricsService.recordChartDrilldown(this.reportId, this.drilldownReport,
            range.ItemName,
            range.ItemName,
            range.Value,
            this.drillsIntoReportId);

        let details: ChartDetail;
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
            reportId: this.reportId
        };

        if (this.stateService.current.name === 'reports-qm') {
            this.filterStateService.setFilter(filterSettings);
            this.reportService.getReportById(this.drillsIntoReportId)
                .then((report) => {
                    this.stateService.transitionTo(this.drilldownDestination,
                        { report: this.utilityService.getRouteFromReportName(report.ReportName) });
                });
        } else if (this.stateService.current.name === 'reports-rehosp') {
            this.filterStateService.setFilter(filterSettings);
            this.stateService.transitionTo(this.drilldownDestination, { report: this.drilldownReport });
        } else if (this.stateService.current.name === 'home.reportDashboard') {
            if (this.stateService.params.category === 'reports-financial') {
                filterSettings.IsDrillDown = details.filter.IsDrillDown = true;
                filterSettings.DashboardId = this.listsStateService.getDashboardIdByNameAndCategory
                    (this.stateService.params.dashboardName, this.stateService.params.category);
                details.category = this.stateService.params.category,
                this.selectedChartStateService.setSelectedChartDetails(details);
            }
            this.filterStateService.setFilter(filterSettings);
            const dashboard = this.listsStateService.getDashboardById(this.drillsIntoReportId);
            this.stateService.transitionTo(this.stateService.current.name,
                {
                    dashboardName: dashboard.DashboardRoute,
                    category: dashboard.Category ? dashboard.Category : ''
                });
        } else if (this.stateService.current.name === 'home.careTransitionsDashboard' &&
            this.reportId === this.listsStateService.getReportEnumByName('ResidentVitals').Id) {
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
            this.onNumberWidgetClick.emit(details);
        }

        if (this.data.indexOf(range) !== -1 && this.options.selectedItem) {
            this.options.selectedItem.value = range.ItemName;
        }
    }

    isItemSelected(item): boolean {
        return (this.options.selectedItem && item[this.options.selectedItem.matchByProp] === this.options.selectedItem.value);
    }

    getValueStyle(item) {
        const style = {
            'color': item[this.options.colorProp]
        };

        if (this.isItemSelected(item)) {
            style['background-color'] = this.getBackgroundColor(item);
        }

        return style;
    }
    shadeColor(color, percentage): string {
        let usePound = false;

        if (color[0] === '#') {
            color = color.slice(1);
            usePound = true;
        }

        const num = parseInt(color, 16);

        let r = (num >> 16) + percentage;

        if (r > 255) { r = 255; } else if (r < 0) { r = 0; }

        let b = ((num >> 8) & 0x00FF) + percentage;

        if (b > 255) { b = 255; } else if (b < 0) { b = 0; }

        let g = (num & 0x0000FF) + percentage;

        if (g > 255) { g = 255; } else if (g < 0) { g = 0; }

        return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);

    }

    getBackgroundColor(item): string {
        const itemColor = this.options.colorProp && item[this.options.colorProp] ?
            item[this.options.colorProp] : '#ffffff';

        return this.shadeColor(itemColor, 99);
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

    fullscreenToggle(isFullscreen, templateId): void {
        if (this.templateId === templateId) {
            if (isFullscreen) {
                const noOfRows = this.data ? this.data.length : 1;
                Object.assign(this.defaultOptions, this.options);

                // Copied to avoid leak when same number widget option object is reused between instances
                Object.assign(this.options, this.options);

                this.options.size = 'large';
                this.options.height = 'calc((100vh - 100px) / ' + Math.ceil(noOfRows / this.options.noOfCardsInRow) + ')';
                this.setWidgetClass(this.options.noOfCardsInRow);
            } else {
                Object.assign(this.options, this.defaultOptions);
                this.setWidgetClass(this.options.noOfCardsInRow);
            }
        }
    }
}
