import { Component, OnInit, ElementRef, Input, SimpleChanges, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'rtms-high-gauge',
    templateUrl: './gauge-chart.component.html'
})

export class GaugeComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() chartName: string;
    @Input() reportId: number;
    @Input() drillsIntoReportId: number;
    @Input() returnsToRoute: string;
    @Input() cardColor: string;
    @Input() seriesData;
    @Input() valueDisplay;
    @Input() valueTotal;
    @Input() valueDescription;
    @Input() yaxisDescription;
    @Input() tooltipFormat;
    @Input() stacking;
    @Input() creditText: any;
    @Input() facilityId;
    @Input() templateId;
    @Input() allowOnClick;
    @Input() showLabels;
    @Input() chartConfig;
    @Input() showTooltip = false;
    @Input() isSelected;
    @ViewChild('content', {static: false}) elementView: ElementRef;

    size = 100;
    borderWidth = 0;

    constructor(private element: ElementRef) {

    }
    ngOnInit() {
        this.setSelectedStyle();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isSelected']) {
            this.setSelectedStyle();
        }
    }

    setSelectedStyle() {
        if (this.isSelected) {
            this.borderWidth = 3;
        } else {
            this.borderWidth = 0;
        }
    }

    ngAfterViewInit() {
        // To avoid Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
        setTimeout(() => {
            this.setSize();
        });
        setInterval(() => {
            this.setSize();
        }, 1000);
    }

    setSize() {
        if (!$(this.element.nativeElement).closest('.information-popup').length) {
            const diameter = Math.floor(this.elementView.nativeElement.clientWidth * 0.8);
            if (diameter > 0) {
                this.size = Math.min(diameter, 250);
            }
        }
    }

}
