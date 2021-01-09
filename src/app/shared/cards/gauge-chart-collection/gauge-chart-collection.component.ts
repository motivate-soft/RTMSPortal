import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { SelectedChartStateService } from 'src/app/shared/services/selected-chart-state.service';
import { ModalPopupService } from 'src/app/shared/services/modal-popup.service';
import { ModalInputs } from 'src/app/shared/models/modal-inputs';
import { MarketingComponent } from '../marketing.component';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { OnChanges, SimpleChanges, ElementRef, Input, Component, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ChartDetail } from '../../models/chart-details';

@Component({
    selector: 'rtms-gauge-collection',
    templateUrl: './gauge-chart-collection.component.html'
})
export class GaugeCollectionComponent implements OnChanges, OnInit {
    @Input() chartName: string;
    @Input() reportId: number;
    @Input() drillsIntoReportId: number;
    @Input() returnsToRoute;
    @Input() seriesData;
    @Input() creditText;
    @Input() facilityId;
    @Input() templateId;
    @Input() allowOnClick;
    @Input() showLabels;
    @Input() chartConfig;
    @Input() isMarketingMode: boolean;
    @Input() singleColumn = false;
    @Output() gaugeClick = new EventEmitter<any>();
    total: number;
    modalInputs: ModalInputs[];
    @ViewChild('gaugeCollection', {static: true}) gaugeCollection: ElementRef;

    constructor(private utilizationMetricsService: UtilizationMetricsService,
        private selectedChartStateService: SelectedChartStateService,
        private modalPopupService: ModalPopupService,
        private userStateService: UserStateService) {
    }

    ngOnInit() {
        this.getValue();
        setInterval(() => {
            this.getValue();
        }, 1000);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['seriesData']) {
            if (!this.seriesData) {
                return;
            }

            const selectedChart: any = this.selectedChartStateService.getSelectedChartDetails(this.reportId);
            let totalcount = 0;
            for (let i = 0; i < this.seriesData.length; i++) {
                const item = this.seriesData[i];
                totalcount += parseInt(item.Value);

                if (selectedChart && selectedChart.filter && selectedChart.filter.FilterValue === item.ItemName) {
                    item.isSelectedGauge = true;
                } else {
                    item.isSelectedGauge = false;
                }
            }
            if (totalcount > 0) {
                this.total = totalcount;
            } else {
                // If zero records, set max to 1
                this.total = 1;
            }
        }
    }

    gaugeClicked(event) {

        if (this.isMarketingModeFun()) {
            const marketingUrl = this.userStateService.getMarketingUrl();
            this.modalInputs = [new ModalInputs('marketingUrl', marketingUrl)];
            this.modalPopupService.showModal(MarketingComponent, this.modalInputs);
            return;
        }
        const filterSettings = {
            FilterValue: event.ItemName
        };

        const details = {
            chartName: this.chartName,
            filter: filterSettings,
            reportId: this.reportId
        } as ChartDetail;

        this.seriesData.forEach(data => {
            data.isSelectedGauge = false;
            if (data.ItemName === event.ItemName) {
                data.isSelectedGauge = true;
            }
        });

        this.utilizationMetricsService
            .recordChartDrilldown(this.reportId, this.chartName, event.ItemName, event.
                ItemName, event.Value, this.drillsIntoReportId);
        this.gaugeClick.emit(details);
    }

    getValue() {
        const narrowContainer = this.gaugeCollection.nativeElement.offsetWidth < 340;
        if (this.gaugeCollection.nativeElement.offsetWidth !== 0) {
            if (!narrowContainer && !this.singleColumn) {
                $('.gaugecontrol').addClass('apply-max-height');
            } else {
                $('.gaugecontrol').removeClass('apply-max-height');
            }
        }
    }

    isMarketingModeFun() {
        return this.isMarketingMode !== undefined && this.isMarketingMode === true;
    }

}
