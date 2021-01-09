import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { RtmsGridComponent } from '../../../shared/components/rtms-grid/rtms-grid.component';
import { PDPMWorksheetComponent } from '../../pdpm-worksheet/pdpm-worksheet.component';
import { IPAAlertComponent } from '../../../shared/cards/ipa-alert/ipa-alert.component';

@Component({
  selector: 'rtms-chart-wrapper',
  templateUrl: './chart-wrapper.component.html',
  styleUrls: ['./chart-wrapper.component.scss']
})
export class ChartWrapperComponent {
  @Input() data: any;
  @Input() hasCitation: boolean;
  @Output() onChartClick = new EventEmitter<any>();
  @Output() gridRowClick = new EventEmitter<any>();
  @Output() gridCellClick = new EventEmitter<any>();

  @ViewChild(RtmsGridComponent, {static: false}) rtmsGridComponent;
  @ViewChild(PDPMWorksheetComponent, {static: false}) pdpmWorksheetComponent;
  @ViewChild(IPAAlertComponent, {static: false}) ipaAlertComponent;


  public onExport(type: string, exportFilter: any): void {
    if (this.data.cardType === 'grid'  &&  this.rtmsGridComponent) {
      this.rtmsGridComponent.onExport(type, exportFilter);
    }
    if (this.data.cardType === 'ipaAlert' && this.ipaAlertComponent) {
      this.ipaAlertComponent.onExport(type, exportFilter);
    }
    if (this.data.cardType === 'pdpmWorksheet' && this.pdpmWorksheetComponent) {
      this.pdpmWorksheetComponent.onExport(type, exportFilter);
    }
  }
}
