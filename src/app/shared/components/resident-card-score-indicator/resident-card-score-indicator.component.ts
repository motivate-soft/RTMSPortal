import { Component, OnInit, Input, SimpleChanges, ViewChild  } from '@angular/core';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';
import { RehospDashboardService } from 'src/app/shared/services/portal/rehospDashboard.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FilterSettings } from '../../models/filter-settings';
import { ResidentScoringDetail } from '../../models/resident-scoring-detail';
import { ResidentCardScoreDetailComponent } from '../resident-card-score-detail/resident-card-score-detail.component';
import { BaseComponent } from '../base.component';
import * as $ from 'jquery';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { getRiskColor } from '../../utility/ui-helper';

@Component({
  selector: 'rtms-resident-card-score-indicator',
  templateUrl: './resident-card-score-indicator.component.html',
  styleUrls: ['./resident-card-score-indicator.component.scss']
})
export class ResidentCardScoreIndicatorComponent implements OnInit {

  @Input() organizationId: string;
  @Input() reportId: number;
  @Input() reportName: string;
  @Input() riskLevel: string;
  @Input() resMrn: string;
  public _showSpinner: boolean;
  public _hideIndicator: boolean;
  public _indicatorColor: string;
  public _residentScoreDetail: ResidentScoringDetail;
  @ViewChild('scorePopOver', {static: false}) public scorePopOver: NgbPopover;
  @ViewChild('residentCardScoreDetailComponent', {static: false}) residentCardScoreDetailComponent: ResidentCardScoreDetailComponent;

  constructor(private utilizationMetricsService: UtilizationMetricsService,
    private rehospDashboardService: RehospDashboardService,
    private userStateService: UserStateService
  ) {
   }

  ngOnInit() {
     this._showSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['riskLevel']) {
      if (this.riskLevel) {
        this.setRiskColor(this.riskLevel);
      } else {
        this._hideIndicator = true;
      }
    }
  }

  protected setRiskColor(riskLevel) {
    this._indicatorColor = getRiskColor(this.riskLevel);
    if (this._indicatorColor) {
      this._hideIndicator = false;
    } else {
      this._hideIndicator = true;
    }
  }

  public showDetail(popover) {
      this._showSpinner = true;
      let filterSettings: FilterSettings;
      filterSettings = {
            OrganizationId: Number(this.organizationId),
            ResMrn: this.resMrn,
            UserTimeZoneId: this.userStateService.getLoggedInUser().TimeZoneId,
      };
      this.utilizationMetricsService.recordResidentIndicatorClick(this.reportId, this.reportName, this.resMrn);
      this.rehospDashboardService.getResidentScore(filterSettings).subscribe(data => {
      this._residentScoreDetail = data;
        if (data !== null) {
          $('#ngbPopover').closest('.fh-report-table-content,.fh-report-table').scroll(function() {
            $('#ngbPopoverClose').trigger( 'click' );
           });
          popover.open();
        } else {
          popover.close();
        }
        this._showSpinner = false;
      });
    }

    protected viewDetails(popover) {
     this.residentCardScoreDetailComponent.showModalDetail(this._residentScoreDetail, this._indicatorColor);
     this.closePopover(popover);
    }

    protected closePopover(popover) {
      if (popover.isOpen()) {
        popover.close();
      }
     }
}
