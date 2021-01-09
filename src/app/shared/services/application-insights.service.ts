import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRouteSnapshot, ResolveEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StateService, UIRouter } from '@uirouter/core';
import { EnvService } from '../environment/env.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';

@Injectable({
    providedIn: 'root',
})
export class ApplicationInsightsService {
  appInsights: ApplicationInsights;
  constructor(
    private stateService: StateService,
    // private router: Router,
    private uiRouter: UIRouter,
    private envService: EnvService,
    private userStateService: UserStateService,
  ) {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: this.envService.appInsightsKey,
        enableAutoRouteTracking: true, // option to log all route changes
        // enableCorsCorrelation: true
      }
    });
    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
    this.loadCustomTelemetryProperties();
    this.createRouterSubscription();
  }

  setUserId(userId: string) {
    this.appInsights.clearAuthenticatedUserContext();
    this.appInsights.setAuthenticatedUserContext(userId, userId, true);
    // this should set the "User Id" shown in the User Timeline (Usage | Users) in AppInsights
    this.appInsights.context.user.id = userId;
  }

  clearUserId() {
    this.appInsights.clearAuthenticatedUserContext();
  }

  logPageView(name?: string, url?: string) { // option to call manually
    this.appInsights.trackPageView({
      name: name,
      uri: url
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights.trackEvent({ name: name}, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    this.appInsights.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    this.appInsights.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    this.appInsights.trackTrace({ message: message}, properties);
  }

  private loadCustomTelemetryProperties() {
    this.appInsights.addTelemetryInitializer(envelope =>
      {
        let item = envelope.baseData;
        let loggedInUser = this.userStateService.getLoggedInUser();
        item.properties = item.properties || {};
        item.properties['ApplicationPlatform'] = 'WEB';
        item.properties['ApplicationName'] = 'Portal';
        item.properties['UserName'] = loggedInUser.UserName;
        item.properties['UserFullName'] = `${loggedInUser.FirstName} ${loggedInUser.LastName}`;
        item.properties['UserId'] = `${loggedInUser.userId}`;
      }
    );
  }

  private createRouterSubscription() {
    this.uiRouter.transitionService.onFinish({}, (transition) => {
      this.logPageView(transition.to().name, transition.to().url);
    });
  }

  private getActivatedComponent(snapshot: ActivatedRouteSnapshot): any {
    if (snapshot.firstChild) {
      return this.getActivatedComponent(snapshot.firstChild);
    }

    return snapshot.component;
  }

  private getRouteTemplate(snapshot: ActivatedRouteSnapshot): string {
    let path = '';
    if (snapshot.routeConfig) {
      path += snapshot.routeConfig.path;
    }

    if (snapshot.firstChild) {
      return path + this.getRouteTemplate(snapshot.firstChild);
    }

    return path;
  }
}
