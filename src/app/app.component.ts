import { Component, OnInit } from '@angular/core';
import { UserActivityService } from './shared/analytics/user-activity.service';
import { ApplicationInitializationService } from './shared/services/portal/applicationInitialization.service';

@Component({
  selector: 'rtms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rtms-portal';
}
