import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'rtms-illogical-adl-score',
  templateUrl: './illogical-adl-score.component.html'
})
export class IllogicalAdlScoreComponent implements OnChanges {

  @Input() data: any;
  @Input() field: string;
  @Input() isShowTooltip; boolean;
  childRows = [];

  illogicalData: string;
  illogicalStateClass: string;
  illogicalTooltip: string;
  illogicalBgColor: string;
  illogicalAdlData: string;

  @ViewChild('illogicalPopover', {static: false})
  private openPopover: NgbPopover;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['field'] || changes['data']) {
      switch (this.field) {
        case 'AdlMobility':
          this.illogicalData = this.data.IllogicalAdlMobilityReason;
          this.illogicalStateClass = this.data.AdlMobilityStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.MobilityInitsExist, this.data.MobilityInits, this.data.AdlMobilityState);
          this.illogicalBgColor = this.data.AdlMobilityStateBgColor;
          this.illogicalAdlData = this.data.AdlMobility;
          break;
        case 'AdlMobilitySup' :
          this.illogicalData = this.data.IllogicalAdlMobilityReason;
          this.illogicalStateClass = this.data.AdlMobilitySupStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.MobilitySupInitsExist, this.data.MobilitySupInits, this.data.AdlMobilitySupState);
          this.illogicalBgColor = this.data.AdlMobilitySupStateBgColor;
          this.illogicalAdlData = this.data.AdlMobilitySup;
          break;
        case 'AdlTransferring' :
          this.illogicalData = this.data.IllogicalAdlTransferringReason;
          this.illogicalStateClass = this.data.AdlTransferringStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.TransferringInitsExist, this.data.TransferringInits, this.data.AdlTransferringState);
          this.illogicalBgColor = this.data.AdlTransferringStateBgColor;
          this.illogicalAdlData = this.data.AdlTransferring;
          break;
        case 'AdlTransferringSup' :
          this.illogicalData = this.data.IllogicalAdlTransferringReason;
          this.illogicalStateClass = this.data.AdlTransferringSupStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.TransferringSupInitsExist, this.data.TransferringSupInits, this.data.AdlTransferringSupState);
          this.illogicalBgColor = this.data.AdlTransferringSupStateBgColor;
          this.illogicalAdlData = this.data.AdlTransferringSup;
          break;
        case 'AdlEating' :
          this.illogicalData = this.data.IllogicalAdlEatingReason;
          this.illogicalStateClass = this.data.AdlEatingStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.EatingInitsExist, this.data.EatingInits, this.data.AdlEatingState);
          this.illogicalBgColor = this.data.AdlEatingStateBgColor;
          this.illogicalAdlData = this.data.AdlEating;
          break;
       case 'AdlEatingSup' :
          this.illogicalData = this.data.IllogicalAdlEatingReason;
          this.illogicalStateClass = this.data.AdlEatingSupStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.EatingSupInitsExist, this.data.EatingSupInits, this.data.AdlEatingSupState);
          this.illogicalBgColor = this.data.AdlEatingSupStateBgColor;
          this.illogicalAdlData = this.data.AdlEatingSup;
          break;
        case 'AdlToileting' :
          this.illogicalData = this.data.IllogicalAdlToiletingReason;
          this.illogicalStateClass = this.data.AdlToiletingStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.ToiletingInitsExist, this.data.ToiletingInits, this.data.AdlToiletingState);
          this.illogicalBgColor = this.data.AdlToiletingStateBgColor;
          this.illogicalAdlData = this.data.AdlToileting;
          break;
        case 'AdlToiletingSup' :
          this.illogicalData = this.data.IllogicalAdlToiletingReason;
          this.illogicalStateClass = this.data.AdlToiletingSupStateClass;
          this.illogicalTooltip = this.getToolTip(this.data.ToiletingSupInitsExist, this.data.ToiletingSupInits, this.data.AdlToiletingSupState);
          this.illogicalBgColor = this.data.AdlToiletingSupStateBgColor;
          this.illogicalAdlData = this.data.AdlToiletingSup;
          break;
      }
    }
  }

  getToolTip(condition1, condition1Value, condition2): string {
    let returnValue = '';

    if (this.isShowTooltip && condition1) {
      returnValue = condition1Value;
    } else if (condition2 !== 'None') {
      returnValue = condition2 + ' since last MDS';
    }
    return returnValue;
  }

  private onScroll = () => {
    if (this.openPopover && this.openPopover.isOpen()) {
      this.openPopover.close();
    }
  }
  shownPopover(): void {
    const tableContentElement = $(this.elementRef.nativeElement).closest('.fh-report-table-content');
    $(tableContentElement).on('scroll', this.onScroll);
  }

  hiddenPopover(): void {
    const tableContentElement = $(this.elementRef.nativeElement).closest('.fh-report-table-content');
    $(tableContentElement).unbind('scroll', this.onScroll);
  }
}
