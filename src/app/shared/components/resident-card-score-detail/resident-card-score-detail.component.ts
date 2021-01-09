import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ResidentScoringDetail } from '../../models/resident-scoring-detail';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { ReportService, ExportService } from 'src/app/shared/services/services-index';
import { FilterStateService } from 'src/app/shared/services/filter-state.service';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';
import { FiltersService } from '../../../filter/store/services/filters.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';

@Component({
  selector: 'rtms-resident-card-score-detail',
  templateUrl: './resident-card-score-detail.component.html',
  styleUrls: ['./resident-card-score-detail.component.scss']
})
export class ResidentCardScoreDetailComponent implements OnInit {

  protected _residentScoreDetail: ResidentScoringDetail;
  protected _indicatorColor: string;
  protected _reportId: number;
  @ViewChild('template', {static: false}) public template: TemplateRef<any>;

  constructor(private _modalService: NgbModal,
              private _listsStateService: ListsStateService,
              private _reportService: ReportService,
              private _exportService: ExportService,
              private _filterStateService: FilterStateService,
              private _filtersService: FiltersService,
              private _utilizationMetricsService: UtilizationMetricsService,
              private userStateService: UserStateService ) {   }

  ngOnInit() {
    this.closeModals();
  }

  public showModalDetail(residentScoreDetail, indicatorColor) {
    this._residentScoreDetail = residentScoreDetail;
    this._indicatorColor = indicatorColor;
    this._modalService.open(this.template, {windowClass: 'resident-indicator-modal'});
  }

  public closeModals() {
    if (this._modalService.hasOpenModals()) {
      this._modalService.dismissAll();
    }
  }

  protected exportResidentCARDDetail () {
     this._reportId = this._listsStateService.getReportEnumByName('ResidentCARDExport').Id;
     this._reportService.getReportById(this._reportId).then(
       response => {
          const report = response;
          const type = 'pdf';
          const filter = this._filterStateService.getFilter();
          filter.UserTimeZoneId = this.userStateService.getLoggedInUser().TimeZoneId,
          filter.ResMRN = this._residentScoreDetail.ResMRN;
          this._utilizationMetricsService.recordExports(this._reportId, report.ReportName, type, filter);
          const org = this._filtersService.organizations.getFirstOrDefault();
          org.OrganizationId = this._residentScoreDetail.FacId;

          const arr = [];
          arr.push(this._residentScoreDetail);

          this._exportService.downloadReport(report, type, arr, filter, org);
        });
  }
}
