import { Component, OnInit, ViewChild, Input, EventEmitter, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ObserverService } from '../../services/services-index';


@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  inputs: ['caption', 'title','template'],
  outputs: ['onConfirmAcknowledge']
})


export class ConfirmComponent implements OnInit {

  @ViewChild('confirmModalTemplate', {static: false}) public confirmModalTemplate: any;

  private modalRef: NgbModalRef;
  public hideChildModal(): void {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  public caption: string = '';
  public title: string = '';

  @Input()
  body: string;

  public template: TemplateRef<any>;

  public onConfirmAcknowledge = new EventEmitter();

  public onConfirm(): void {
    this.onConfirmAcknowledge.emit(true);
    this.modalRef.close();
  }

  constructor(
    private _observerService: ObserverService,
    private modalService: NgbModal
  ) {
  }

  public Show() {
    this.modalRef = this.modalService.open(this.confirmModalTemplate, {
      'backdrop': 'static'
    });
  }

  ngOnInit() {
    if (this.title === null || this.title === '') {
      this.title = 'Do you want to delete this';
    }
  }


  ngOnDestroy() {
    this._observerService.$unsbscribe_ConfirmEntryEvent();
  }
}
