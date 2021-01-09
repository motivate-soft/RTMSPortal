import { Component, OnInit } from '@angular/core';
import { FeedbackService } from './feedback.service';
import { ToastrService } from 'ngx-toastr';
import { FiltersService } from '../../filter/store/services/filters.service';
import * as moment from 'moment';

@Component({
    selector: 'rtms-feedback',
    templateUrl: './feedback.component.tpl.html'
})
export class FeedbackComponent {
    message = '';
    feedbackStep = 1;

    constructor(private feedbackService: FeedbackService, private toastrService: ToastrService, private filtersService: FiltersService) { }

    setFeedbackStep = (val) => {
        this.feedbackStep = val;
    }

    toggleFeedbackPanel = () => {
        if (this.feedbackStep > 1) {
            this.feedbackStep = 1;
        } else {
            this.feedbackStep++;
        }
    }

    sendEmail = () => {
        if (this.message === '') { return; }

        this.feedbackService.sendEmail(this.message)
            .subscribe(() => {
                this.feedbackStep++;
                this.message = '';
            }, (error) => {
                this.toastrService.error(error.statusText, 'Failed to send feedback');
            });
    }
}
