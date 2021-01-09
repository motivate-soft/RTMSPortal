import { Component, Injectable, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    template: `
    <div class="marketing-title" style="background-color: #0074bd;height: 30px;color: white;padding-left: 5px;padding-top: 5px;font-weight: bold;">Real Time Lite - Notification</div>
    <div style="padding: 15px 25px 5px 5px;font-weight:bold"><div class="text-center">Access to detail requires an upgrade to Real Time Standard.<br/><br/>
    Please click <a href="" (click)="moreInfo()">here</a> to learn more.</div>
    </div>
    <div class="modal-footer info-footer text-center"><button class="btn btn-info" type="button" (click)="activeModal.close('Close click')">
    <i class="fa fa-close" title="Close"></i> &nbsp; Close</button > &nbsp;
    <button class="btn btn-info" type="button" style="background-color: rgb(0, 128, 0) !important;border-color: rgb(0, 128, 0);" (click)="moreInfo()">Learn More <i class="fa fa-arrow-right" title="Learn More"></i></button></div>
    `
})
export class MarketingComponent {
    @Input() marketingUrl: string;

    constructor(public activeModal: NgbActiveModal) {}

    moreInfo() {
        window.open(this.marketingUrl, '_blank');
    }

}
