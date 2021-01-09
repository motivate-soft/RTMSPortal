import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import * as $ from 'jquery';
import { UINotifierService } from '../../services/services-index';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { UIEventTypes } from '../../enums/ui-event-types';
import { ListsStateService } from '../../../lists/store/services/lists-state.service';

@Component({
  selector: 'rtms-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {

  @Input() templateId: string;
  @Input() chartName: string;
  @Input() reportId: number;
  @Input() exportDisabled: boolean;
  @Input() isDetailed: boolean;
  @Output() export = new EventEmitter<string>();
  exportCardPdfEnabled = false;

  constructor(private utilizationMetricsService: UtilizationMetricsService,
    public uiNotifierService: UINotifierService,
    private listsStateService: ListsStateService) {
  }

  ngOnInit() {
    this.exportCardPdfEnabled = this.reportId === this.listsStateService.getReportEnumByName('CARDDetail').Id;
  }

  public showFullScreenClick($event: any): void {
    this.utilizationMetricsService.recordFullScreen(this.reportId, this.chartName);

    const toggleFullScreen = (fullscreen) => {
      const uiEvents = {
        type: UIEventTypes.FullScreen,
        value: {
          templateId: this.templateId,
          toggle: fullscreen
        }
      } as PortalUIEvent;
      this.uiNotifierService.publishEvents(uiEvents);
    };
    const _bgClass = 'fullscreen-background',
      _btnClass = 'fullscreen-close-btn',

      // see main.css > .fullscreen for refference
      fsMargins = 10,
      fsTopMargin = 50,
      animationDuration = 300,

      trigger = $event.currentTarget,
      fsElement = $(trigger).closest('.fullscreen'), // What will be fullscreened
      fsHolder = $(trigger).closest('.fullscreen-holder'), // Used to keep layout the same

      elementHeight = fsElement.height(),
      elementWidth = fsElement.width(),
      elementDefaultPosition = fsElement.offset(),
      fsHeight = $(window).height() - (fsTopMargin + fsMargins),
      fsWidth = $(window).width() - (fsMargins * 2);

    let fsBG = fsHolder.find('.' + _bgClass),
      fsCloseBtn = fsHolder.find('.' + _btnClass),
      fsCardFlip = $(trigger).closest('.card-flip');

    fsCardFlip.removeClass('card-flip');
    toggleFullScreen(true);

    // Create close button if not exist
    fsCloseBtn = fsCloseBtn.length
      ? fsCloseBtn
      : fsHolder
        .append('<button class="' + _btnClass
          + ' btb btn-sm btn-hollow"><i class="fa fa-close" title="Exit Full Screen"></i>&nbsp;Exit Full Screen</button>')
        .find('.' + _btnClass);


    // Create bg if not exist
    fsBG = fsBG.length
      ? fsBG
      : fsHolder
        .append('<div class="' + _bgClass + '"></div>')
        .find('.' + _bgClass);

    // Avoid layout changes
    // ToDo: Responsiveness

    // IMPORTANT!!!
    //      Make sure fsElement element has height and width > 0,
    //      check floats and such
    fsHolder.height(elementHeight);
    fsHolder.width(elementWidth);


    function exitFullscreen(e: any) {

      const bgClicked = e.target === fsBG[0],
        btnClicked = e.target === fsCloseBtn[0];

      function exit(e) {

        fsCardFlip.addClass('card-flip');
        toggleFullScreen(false);

        // Handle background and button
        [fsBG, fsCloseBtn].map(function (el) {
          el.removeClass('visible');
        });

        setTimeout(() => {
          [fsBG, fsCloseBtn].map(function (el) {
            el.removeClass('show');
          });
        }, animationDuration);


        // Handle element
        fsElement.animate({
          top: elementDefaultPosition.top - (document.body.scrollTop || window.scrollY) + 'px',
          left: elementDefaultPosition.left + 'px',
          height: elementHeight + 'px',
          width: elementWidth + 'px'
        }, animationDuration, function () {
          fsElement.removeClass('fullscreen-done');
          fsElement.removeAttr('style');
          fsHolder.removeAttr('style');
        });

        // Add events
        [fsBG, fsCloseBtn].map(function (el) {
          el.off('click touchstart', exitFullscreen);
          el.addClass('show');
        });
      }

      if (bgClicked || btnClicked) {
        exit(e);
      }
    }

    [fsBG, fsCloseBtn].map(function (el) {
      el.on('click touchstart', exitFullscreen);
      el.addClass('show');
    });

    // workaround for smooth animation
    setTimeout(() => {
      [fsBG, fsCloseBtn].map(function (el) {
        el.addClass('visible');
      });
    }, 10);

    // Handle element

    fsElement.css({
      height: elementHeight + 'px',
      width: elementWidth + 'px',
      top: elementDefaultPosition.top - (document.body.scrollTop || window.scrollY) + 'px',
      left: elementDefaultPosition.left + 'px'
    });

    fsElement.addClass('fullscreen-started');

    // workaround for smooth animation
    setTimeout(() => {
      fsElement.animate({
        top: fsTopMargin + 'px',
        left: fsMargins + 'px',
        height: fsHeight + 'px',
        width: fsWidth + 'px'
      }, animationDuration, function () {
        fsElement.addClass('fullscreen-done');
        fsElement.removeClass('fullscreen-started');
        fsElement.removeAttr('style');
      });
    }, 10);
  }

}
