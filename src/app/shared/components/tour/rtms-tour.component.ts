import { Component, OnInit, OnDestroy, TemplateRef, Input, ViewChild } from '@angular/core';
import { FilterDashboardService } from '../../services/portal/filter-dashboard.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { TourStateService } from 'src/app/tour/services/tour-state.service';
import { ReportService } from '../../services/services-index';
import * as $ from 'jquery';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as introJs from 'intro.js/intro.js';
import { StateService, UrlService } from '@uirouter/core';
import { BaseComponent } from '../base.component';

@Component({
    selector: 'rtms-tour',
    templateUrl: './rtms-tour.component.html',
    styleUrls: ['./rtms-tour.component.scss']
})

export class RtmsTourComponent extends BaseComponent implements OnInit, OnDestroy {
    constructor(private filterDashboardService: FilterDashboardService,
        private filterService: FiltersService,
        private tourService: TourStateService,
        private reportService: ReportService,
        private stateService: StateService,
        private modalService: NgbModal,
        private urlService: UrlService) {
        super();
        this.isDestroyed = false;
    }
    introJsObj = introJs();
    @Input() dashboardId: number;
    @Input() showIntro: boolean;
    @ViewChild('skipToursPopup', {static: false}) public skipToursPopup: TemplateRef<any>;
    introOptions: any = {};
    currentOrganizationId: number = this.filterDashboardService.getSelectedOrganization().OrganizationId;
    currentTour: any = {};
    tours = [];
    isSkipped: boolean;
    tourModal: NgbActiveModal;
    isDestroyed: boolean;
    rtmsTour: any;
    ngOnInit() {
        this.introOptions = {
            showStepNumbers: true,
            showBullets: true,
            exitOnOverlayClick: false,
            exitOnEsc: true,
            nextLabel: '<strong>Next</strong>',
            prevLabel: '<span style="color:green">Previous</span>',
            skipLabel: 'Exit',
            doneLabel: 'Done',
            appendTo: 'body',
            disableInteraction: true
        };
        this.subscriptions.push(this.filterService.organizations.getOrganizationFeatureStream()
            .subscribe(orgList => {
                if (orgList && orgList.length > 0) {
                    const newOrganizationId = this.filterDashboardService.getSelectedOrganization().OrganizationId;
                    if (newOrganizationId !== this.currentOrganizationId) {
                        this.currentOrganizationId = newOrganizationId;
                        this.getPendingTours();
                    }
                }
            }));
        this.introJsObj.setOptions(this.introOptions);
        this.introJsObj.onexit(() => {
            this.exitEvent();
        });
        this.introJsObj.oncomplete(() => {
            this.completedEvent();
        });
        this.getPendingTours();
    }

    getPendingTours() {
        if (this.dashboardId > 0) {
            this.reportService.getPendingTours(this.dashboardId, this.currentOrganizationId).subscribe(response => {
                this.currentTour = this.tourService.getCurrentTour();
                if (this.currentTour && this.currentTour.TourId > 0) {
                    this.tours.push(this.currentTour);
                    response = response.filter(tour => {
                        return tour.TourId !== this.currentTour.TourId;
                    });
                }
                response.forEach(tour => {
                    this.tours.push(tour);
                });
                this.getTourSteps();
            });
        }
    }

    executeTourSteps(steps) {
        setTimeout(() => {
            this.introOptions.steps = [];
            if (this.haveNavigateTourStep(steps)) {
                this.introOptions.doneLabel = 'Navigate';
                for (var i = 0; i < steps.length; i++) {
                    if (this.checkForNavigationUrl(steps[i].NavigationUrl)) {
                        break;
                    }
                    this.introOptions.steps.push(steps[i]);
                }
            } else {
                this.introOptions.steps = steps;
            }
            this.introJsObj.setOptions(this.introOptions);
            if (this.introOptions.steps.length > 0) {
                this.introOptions.TourId = this.tours[0].TourId;
                $('body').addClass('auto-overflow');
                this.introJsObj.start();
            } else {
                if (steps.length > 0) {
                    this.completedEvent();
                }
            }
        }, 2000);
    }

    haveNavigateTourStep(steps) {
        const isNavigateTourSteps = steps.filter(step => {
            return this.checkForNavigationUrl(step.NavigationUrl);
        });
        return (isNavigateTourSteps.length > 0);
    }

    checkForNavigationUrl(url): any {
        return (url !== '' && url !== null && url !== this.stateService.current.url.replace('/', ''));
    }

    completedEvent() {
        const tour = this.tours[0];
        tour.steps = this.excludeExecutedTourSteps(tour.steps);
        if (this.haveNavigateTourStep(tour.steps)) {
            // set current tour and navigate to the target page
            this.introOptions.isNavigation = true;
            this.tourService.setCurrentTour(tour);
            this.urlService.url(tour.steps[0].NavigationUrl);
        } else {
            // save tour with completed status
            tour.StatusId = 'Completed';
            this.introOptions.isCompleted = true;
            this.introOptions.isNavigation = false;
            this.saveTourUser(tour);
        }
    }

    excludeExecutedTourSteps(steps) {
        const stepIndex = steps.findIndex(step => this.checkForNavigationUrl(step.NavigationUrl));
        steps = steps.slice(stepIndex);
        return steps;
    }

    saveTourUser(tour) {
        return this.reportService.saveTourUser(tour).subscribe((response) => { });
    }
    saveAllTourUsers(tours) {
        this.reportService.saveAllTourUsers(tours).subscribe((response) => { });
    }

    getTourSteps() {
        if (this.tours.length > 0) {
            const tourId = this.tours[0].TourId;
            this.introOptions.doneLabel = 'Done';

            this.currentTour = this.tourService.getCurrentTour();
            // if current tour then fetch steps from tour service
            if (this.currentTour !== null && this.currentTour.TourId > 0 && this.currentTour.TourId === tourId) {
                this.tourService.clearCurrentTour();
                this.currentTour.steps[0].NavigationUrl = null;
                this.executeTourSteps(this.currentTour.steps);
            } else {
                // else fetch steps from api
                this.reportService.getTourSteps(tourId).subscribe((response) => {
                    if (this.isDestroyed !== true) {
                        this.tours[0].allSteps = response;
                        this.tours[0].steps = response;
                        this.executeTourSteps(response);
                    }
                });
            }
        }
    }

    exitEvent() {
        if (this.tours.length > 0) {
            if (this.introOptions.isCompleted) {
                this.tours.shift();
                this.getTourSteps();
            } else if (this.introOptions.isNavigation) {
                // do nothing if exit event called because of navigation
                return;
            } else if (!this.isSkipped) {
                // ask to skip only current tour or all tours and according to selection
                this.tourModal = this.modalService.open(this.skipToursPopup, {
                    backdrop: 'static',
                    keyboard: false
                });
                this.isSkipped = true;
            }
        }
        $('body').removeClass('auto-overflow').addClass('hide-overflow');
        $(window).scrollTop(0);
    }

    skipCurrentTour() {
        // save tour with skipped status
        const tour = this.tours[0];
        if (tour.TourUserId === 0) {
            tour.StatusId = 'Skipped';
            this.saveTourUser(tour);
        }
        this.tours.shift();
        this.getTourSteps();
        this.tourModal.close();
    }

    skipAllTours() {
        // save all tours with pending status
        this.saveAllTourUsers(this.tours);
        this.tours = [];
        this.tourModal.close();
    }

    ngOnDestroy() {
        this.isDestroyed = true;
    }
}
