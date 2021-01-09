import { Component, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { trigger, transition, style, animate } from '@angular/animations';
import { UtilityService } from '../../services/services-index';

@Component({
  selector: 'rtms-information-popup',
  templateUrl: './information-popup.component.html',
  styleUrls: ['./information-popup.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class InformationPopupComponent implements AfterViewInit {
  @Input() Data: any;
  constructor(private activeModal: NgbActiveModal) {}

  ngAfterViewInit() {
    if (this.Data.embedChart) {
      $('.info-chart').append(this.Data.chartElement);
      $('.dropdown-toggle').css('display', 'None');
    }
    setTimeout(() => {
      $('ngb-modal-backdrop').addClass('m_b_o');
    }, 100);
  }
  close() {
    $('ngb-modal-window').removeClass('in');
    setTimeout(() => {
      this.activeModal.close();
    }, 300);
  }
  getDocumentedInnerHtml() {
    if (this.Data.informationData.Sources.length > 0) {
      let innerHtml = '<div class="col-md-12"><span style="font-weight:bold;">Documented:</span>';
      let loadedFromUiStringHtml = '';
      for(let i = 0; i < this.Data.informationData.Sources.length; i++) {
        innerHtml += `<div>${this.Data.informationData.Sources[i].DocumentedUIString}</div>`;
        loadedFromUiStringHtml += `<div>${this.Data.informationData.Sources[i].LoadedFromUIString}</div>`;
      }

      innerHtml += '</div><div class="col-md-12 informationmodal-loadedfrom-spacing"><span style="font-weight:bold;">Loaded From:</span>';
      innerHtml += loadedFromUiStringHtml;
      innerHtml += '</div>';
      return innerHtml;
    }
  }
}
