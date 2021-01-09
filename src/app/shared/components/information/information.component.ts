import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { InformationPopupComponent } from '../information-popup/information-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { ReportService } from '../../services/services-index';

@Component({
  selector: 'rtms-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @Input() chartName: string;
  @Input() reportId: number;
  @Input() embedChart: boolean;
  showInfo = true;
  informationData: any;
  chartElement: any;
  chartHolder: any;
  constructor(
    private modalService: NgbModal,
    private reportService: ReportService,
    private filtersService: FiltersService
  ) { }

  ngOnInit() { }

  getChartInformationData(trigger) {
    this.showInfo = false;
    const selectedOrganization = this.filtersService.organizations.getFirstOrDefault();
    const organizationId = selectedOrganization
      ? selectedOrganization.OrganizationId
      : null;
    this.informationData = this.reportService
      .getInformation(organizationId, this.reportId)
      .subscribe(data => {
        if (data != null) {
          this.informationData = data;
          const modalRef = this.modalService.open(InformationPopupComponent, {
            windowClass: 'info-modal in info-color'
          });
          if (this.embedChart) {
            if ($('.info-chart')) {
              (this.chartElement = $(trigger).closest('.fullscreen')),
                (this.chartHolder = $(trigger).closest('.fullscreen-holder'));

              this.chartHolder.height(this.chartElement.height());
              this.chartHolder.width(this.chartElement.width());
            }
          }

          modalRef.componentInstance.Data = {
            chartName: this.chartName,
            embedChart: this.embedChart,
            informationData: this.informationData,
            chartElement: this.chartElement,
            reportCitationSections: data.ReportCitationSections,
          };

          modalRef.result.then(
            () => {
              this.onClose();
            },
            () => {
              this.onClose();
            }
          );
        }
      });
  }

  onClose() {
    this.showInfo = true;
    if (this.embedChart) {
      this.chartHolder.append(this.chartElement);
      this.chartHolder.removeAttr('style');
      $('.dropdown-toggle').css('display', 'inline-block');
      // $rootScope.$broadcast('resize-charts', $modalCtrl.Data.chartName);
    }
  }

  getAngularticsProperties() {
    return this.looseJsonParse(`{ 'reportId': ${this.reportId}, 'category': ${this.reportId} }`);
  }

  looseJsonParse(obj){
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
    return Function('"use strict";return (' + obj + ')')();
}
}
