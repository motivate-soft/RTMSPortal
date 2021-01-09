import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ExportService } from 'src/app/shared/services/services-index';

@Component({
  selector: 'rtms-pdpm-worksheet',
  templateUrl: './pdpm-worksheet.component.html',
  styleUrls: ['./pdpm-worksheet.component.scss']
})
export class PDPMWorksheetComponent {

  @Input() data: any;

  currentStatusCode = null;
  currentResMRN = null;
  returnValue = false;
  searchText = '';

  constructor(private exportService: ExportService
  ) { }

  hasSectionChanged(sectionCode, resMRN) {
    let returnValue = false;

    if (this.currentStatusCode !== sectionCode || this.currentResMRN !== resMRN) {
      this.returnValue = true;
      returnValue = true;
    }

    this.currentStatusCode = sectionCode;
    this.currentResMRN = resMRN;
    return returnValue;
  }

  formatDate(date) {
    const dateOut = new Date(date);
    return dateOut;
  }

  public onExport(type: string, exportFilter: any): void {
    let filteredJson = null;

    if (this.searchText) {
      filteredJson = this.filterData(this.data.seriesData, this.searchText);
    } else {
      filteredJson = this.data.seriesData;
    }
    this.exportService.exportReport(this.data.reportId, this.data.chartName, type, filteredJson, exportFilter);
  }

  filterData(data, searchText): any {
    return data.filter(obj =>
      Object.keys(obj).some(k => {
        return ('' + obj[k]).toLowerCase().includes(searchText.toLowerCase());
      })
    );
  }

}
