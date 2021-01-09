import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Idle } from '@ng-idle/core';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { BaseComponent } from 'src/app/shared/components';
import { StateService } from '@uirouter/core';

@Component({
  selector: 'rtms-logoutalert',
  templateUrl: './logout-alert.component.html'
})
export class LogoutAlertComponent extends BaseComponent {

  countDownValue;
  @ViewChild('template', {static: true}) public template: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private idle: Idle,
    private utilizationMetricsService: UtilizationMetricsService,
    private stateService: StateService
  ) {
    super();
    this.closeModals();

  this.subscriptions.push(this.idle.onIdleStart.subscribe(() => {
      this.closeModals();
      this.modalService.open(this.template, { windowClass: 'modal-danger' });
    }));

    this.subscriptions.push(this.idle.onIdleEnd.subscribe(() => {
      this.closeModals();
      this.idle.watch();
    }));

    this.subscriptions.push(this.idle.onTimeout.subscribe(() => {
      this.utilizationMetricsService.recordInActiveUserLogout();
      this.closeModals();
        this.stateService.transitionTo('home.logout');
    }));

    this.subscriptions.push(this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.countDownValue = countdown;
    }));
  }

  public closeModals() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

}
