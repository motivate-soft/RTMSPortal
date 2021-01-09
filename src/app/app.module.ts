import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ROUTES } from './app-routes';
import { AppComponent } from './app.component';
import { UIRouterModule, TransitionService } from '@uirouter/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FileSaverModule } from 'ngx-filesaver';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HighchartsChartModule  } from 'highcharts-angular';
import { Angulartics2UirouterModule } from 'angulartics2/uiroutermodule';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { LaddaModule } from 'angular2-ladda';
import { AngularResizedEventModule } from 'angular-resize-event';
import {DemoMaterialModule} from './shared/material-module';
import { AuthModule } from './shared/auth/auth.module';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { reducers, metaReducers } from './reducers';
import { FilterModule } from './filter/filter.module';
import { UserModule } from './user/user.module';
import { environment } from '../environments/environment';
import { InboxGroupFilterPipe, InboxFilterPipe, GridFilterPipe,
  ReportSearchFilterPipe, SearchFilterPipe, SafeHtmlPipe } from './shared/pipes/index';
import {
  ChartComponent, UnorderedListCardComponent, GridCardComponent,
  ResidentDetailCardComponent, ResidentDetailCareTransitionsComponent,
  ResidentSocialServicesComponent, NumberWidgetComponent, QuiltComponent
} from './shared/cards/index';
import { MarketingComponent } from './shared/cards/marketing.component';
import { Angulartics2Module } from 'angulartics2';
import { LoaderComponent } from './shared/loader/loader/loader.component';
import { DrillDownModule } from './drill-down/drill-down.module';
import { DocumentationModule } from './documentation/documentation.module';
import { ListsModule } from 'src/app/lists/lists.module';
import { ServiceModule } from './service.module';
import { DashboardService } from './shared/services/portal/dashboard.service.';
import { RtmsGridV2Component, ResidentPagerComponent,
  SideBarComponent, CustomerInformationComponent, ResidentCardScoreIndicatorComponent,
  ResidentCardScoreDetailComponent, ResidentVitalsByCategoryComponent } from './shared/components/index';
import { FacilitySelectorComponent } from './shared/components/facility-selector/facility-selector.component';
import { LoaderService } from './shared/loader/services/loader.service';
import { ExceptionLoggerService } from './shared/services/portal/exception-logger.service';
import { ExceptionHandlerService } from './shared/services/portal/exception-handler.service';
import { LoaderInterceptor } from './shared/loader/interceptors/loader.interceptor';
import { FilterComponent } from './shared/components/filter/filter.component';
import { UINotifierService } from './shared/services/services-index';
import {CalendarModule} from 'primeng/calendar';
import { NgxGaugeModule } from '@tarktech/ngx-gauge';
import { GaugeCollectionComponent } from './shared/cards/gauge-chart-collection/gauge-chart-collection.component';
import { GaugeComponent } from './shared/cards/gauge-chart/gauge-chart.component';
import { UserInterfaceModule } from './userInterface/userInterface.module';
import { EnvServiceProvider } from './shared/environment/env.service.provider';
import {
  InboxComponent, LoginComponent, LogoutComponent, LockScreenComponent, LogoutAlertComponent, NoAccessFeatureComponent,
  AuthCallbackComponent, AuthFailureComponent, PasswordChangeComponent, PasswordResetComponent, RequestPasswordResetComponent,
  UserSettingsComponent, FeedbackComponent, ReportLandingComponent, ErrorTestComponent, UserManagementComponent,
  UserManagementAddComponent, NotificationComponent, SSOComponent,
  GenericDashboardComponent, ChartWrapperComponent, HelpComponent, LogoutSSOComponent, DocumentationComponent
} from './pages';
import { ExportDataComponent } from './shared/components/export-data/export-data.component';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import { BusyLoaderComponent } from './shared/loader/busy-loader/busy-loader.component';
import { ReportsHeaderComponent } from './shared/components/reports-header/reports-header.component';
import { InformationPopupComponent } from './shared/components/information-popup/information-popup.component';
import { RtmsCardComponent } from './shared/cards/rtms-card/rtms-card.component';
import { InformationComponent } from './shared/components/information/information.component';
import { ExportableDirective } from './shared/directives/exportable.directive';
import { TopBarComponent } from './shared/components/top-bar/top-bar.component';
import { RtmsCardFilterComponent } from './shared/components/rtms-card-filter/rtms-card-filter.component';
import { RtmsGridComponent } from './shared/components/rtms-grid/rtms-grid.component';
import { ReportsFooterComponent } from './shared/components/reports-footer/reports-footer.component';
import { IllogicalAdlScoreComponent } from './shared/components/illogical-adl-score/illogical-adl-score.component';
import { MdsDashDetailComponent } from './pages/mds-dash-detail/mds-dash-detail.component';
import { PDPMWorksheetComponent } from './pages/pdpm-worksheet/pdpm-worksheet.component';
import { IPAAlertComponent } from './shared/cards/ipa-alert/ipa-alert.component';
import { HomeComponent } from './home.component';
import { ApplicationInitializationService } from './shared/services/portal/applicationInitialization.service';
import { UserActivityService } from './shared/analytics/user-activity.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppInitializer } from './shared/services/app-initalizer.service';
import { appInitializer } from '@uirouter/angular';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

export function initializeApp(_appInitializer: AppInitializer) {
  return () => {
    return _appInitializer.initializeAuth0Client();
  };
}

// Factory Function. We were getting build errors when calling RtmsConstantService directly
// inside the route config
export function getBusyConfig() {
  return new BusyConfig({
    message: '',
    backdrop: true,
    template: BusyLoaderComponent,
    delay: 1000,
    minDuration: 0,
  });
}
import { RtmsTourComponent } from './shared/components/tour/rtms-tour.component';
import { TourModule } from './tour/tour.module';
import { NoDataFoundComponent } from './shared/components/no-data-found/no-data-found.component';
import { ResidentLabResultsComponent } from './shared/components/resident-lab-results/resident-lab-results.component';
import { UserOrganizationEditComponent } from './shared/components/user/user-organization/user-organization-edit.component';
import { ConfirmComponent } from './shared/components/confirm/confirm.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { CellClickComponent } from './pages/generic-dashboard/handlers/CellClickComponent';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FeedbackComponent,
    ReportLandingComponent,
    InboxComponent,
    InboxGroupFilterPipe,
    InboxFilterPipe,
    ReportSearchFilterPipe,
    SafeHtmlPipe,
    GridFilterPipe,
    MarketingComponent,
    LoaderComponent,
    UnorderedListCardComponent,
    RtmsGridV2Component,
    ResidentPagerComponent,
    SideBarComponent,
    GridCardComponent,
    ResidentDetailCardComponent,
    ResidentDetailCareTransitionsComponent,
    FilterComponent,
    FacilitySelectorComponent,
    ResidentSocialServicesComponent,
    GaugeCollectionComponent,
    GaugeComponent,
    ChartComponent,
    NumberWidgetComponent,
    QuiltComponent,
    ResidentCardScoreIndicatorComponent,
    ResidentCardScoreDetailComponent,
    SSOComponent,
    LoginComponent,
    LogoutComponent,
    LockScreenComponent,
    LogoutAlertComponent,
    NoAccessFeatureComponent,
    ErrorTestComponent,
    AuthCallbackComponent,
    AuthFailureComponent,
    PasswordChangeComponent,
    PasswordResetComponent,
    RequestPasswordResetComponent,
    UserSettingsComponent,
    UserManagementComponent,
    UserManagementAddComponent,
    HelpComponent,
    NotificationComponent,
    ReportsHeaderComponent,
    ExportableDirective,
    RtmsCardComponent,
    GenericDashboardComponent,
    InformationComponent,
    InformationPopupComponent,
    ChartWrapperComponent,
    ExportDataComponent,
    BusyLoaderComponent,
    CustomerInformationComponent,
    ExportableDirective,
    TopBarComponent,
    RtmsCardFilterComponent,
    BusyLoaderComponent,
    RtmsGridComponent,
    SearchFilterPipe,
    ReportsFooterComponent,
    IllogicalAdlScoreComponent,
    MdsDashDetailComponent,
    PDPMWorksheetComponent,
    IPAAlertComponent,
    RtmsTourComponent,
    ResidentVitalsByCategoryComponent,
    LogoutSSOComponent,
    NoDataFoundComponent,
    ResidentLabResultsComponent,
    UserOrganizationEditComponent,
    ConfirmComponent,
    DocumentationComponent
  ],
  imports: [
    BrowserModule,
    ScrollingModule,
    NgxGaugeModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    CalendarModule,
    TabsModule.forRoot(),
    UIRouterModule.forRoot({
      states: ROUTES,
      otherwise: '/login'
    }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LocalStorageModule.forRoot({
        prefix: 'rtms-portal',
        storageType: 'sessionStorage'
    }),
    AuthModule,
    AngularResizedEventModule,
    ToastNoAnimationModule.forRoot({
      closeButton: true,
      timeOut: 10000
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production
    }),
    FilterModule,
    TourModule,
    UserModule,
    FileSaverModule,
    DemoMaterialModule,
    FormsModule,
    NgSelectModule,
    Angulartics2Module.forRoot(),
    Angulartics2UirouterModule.forRoot({
      pageTracking: {
        excludedRoutes: [
          '/errortest',
          '/requestPasswordReset',
          '/login',
          'logout',
          '/help',
          '/errorTest',
          '/passwordreset',
          '/authcallback'
        ],
      }
    }),
    HighchartsChartModule,
    NgbModule.forRoot(),
    DrillDownModule,
    DocumentationModule,
    ListsModule,
    ServiceModule,
    UserInterfaceModule,
    NgIdleKeepaliveModule.forRoot(),
    UserInterfaceModule,
    LaddaModule,
    NgbProgressbarModule,
    NgBusyModule.forRoot({
      message: '',
      backdrop: true,
      template: BusyLoaderComponent,
      delay: 1000,
      minDuration: 0,
    }),
    ModalModule.forRoot(),
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
  ],
  exports: [
    InboxGroupFilterPipe,
    InboxFilterPipe,
    ReportSearchFilterPipe,
    GridFilterPipe
  ],
  providers: [
    AppInitializer,
    DashboardService,
    LoaderService,
      {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    ExceptionLoggerService,
    ExceptionHandlerService,
    { provide: ErrorHandler, useClass: ExceptionHandlerService, },
    UINotifierService,
    EnvServiceProvider,
    ReportSearchFilterPipe,
    GridFilterPipe,
    NotificationComponent,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitializer], multi: true},
    CellClickComponent,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    RtmsTourComponent,
    BusyLoaderComponent,
    InformationPopupComponent,
    MarketingComponent
  ]
})
export class AppModule {
  constructor(applicationInitializationService: ApplicationInitializationService, userActivityService: UserActivityService) {
    applicationInitializationService.Initialize();
    userActivityService.startTracking();
  }
 }
