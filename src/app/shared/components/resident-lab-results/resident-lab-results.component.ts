import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FilterSettings } from '../../models/filter-settings';
import { DashboardDataService } from '../../services/portal/dashboardData.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResidentLabResult } from '../../models/residentLabResult';

@Component({
  selector: 'rtms-resident-lab-results',
  templateUrl: './resident-lab-results.component.html',
  styleUrls: ['./resident-lab-results.component.scss']
})
export class ResidentLabResultsComponent implements OnInit {

  public _hideIndicator: boolean;
  public residentLabResult: ResidentLabResult[];
  public testName: String = '';
  public showSpinner = false;
  @ViewChild('template', {static: false}) public template: TemplateRef<any>;

  constructor(
    private dashboardDataService: DashboardDataService,
    private modalService: NgbModal,
  ) {
  }
  ngOnInit() {
  }


  public showLabHistory(filterSettingsValue: FilterSettings): void {
    this.showSpinner = true;
    this.residentLabResult = [];
    this.modalService.open(this.template, {windowClass: 'resident-labs-modal'});
    this.testName = filterSettingsValue.filterValue;
    this.dashboardDataService.getResidentLabHistory(filterSettingsValue).subscribe(data => {
      this.residentLabResult = data;
      this.showSpinner = false;
    });
  }
  public closeModals() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

}
