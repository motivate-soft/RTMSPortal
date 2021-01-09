import { Component, OnInit, Input, SimpleChanges, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterSettings } from '../../models/filter-settings';
import * as $ from 'jquery';
import { ResidentVitals } from '../../models/resident-vitals';
import { DashboardDataService } from '../../services/portal/dashboardData.service';

@Component({
  selector: 'rtms-resident-vitals-by-category',
  templateUrl: './resident-vitals-by-category.component.html',
  styleUrls: ['./resident-vitals-by-category.component.scss']
})
export class ResidentVitalsByCategoryComponent implements OnInit {

  public _hideIndicator: boolean;
  public residentVitals: ResidentVitals[] = null;
  filterSettingsValue: FilterSettings;
  public showSpinner: boolean;

  @ViewChild('template', {static: false}) public template: TemplateRef<any>;

  constructor(
    private dashboardDataService: DashboardDataService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.showSpinner = false;
    this.residentVitals = [];
  }

  public showVitalDetails(filterSettingsValue): void {
    this.showSpinner = true;
    this.filterSettingsValue = filterSettingsValue;
    this.residentVitals = [];
    this.modalService.open(this.template, {windowClass: 'resident-vitals-modal'});

    this.dashboardDataService.getResidentVitalsByCategory(filterSettingsValue).subscribe(data => {
      this.residentVitals = data;
      this.showSpinner = false;
      this.residentVitals = this.residentVitals;

    });
  }
  public closeModals() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

}
