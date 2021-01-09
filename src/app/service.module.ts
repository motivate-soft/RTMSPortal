import { NgModule } from '@angular/core';
import { FeedbackService } from './pages/feedback/feedback.service';
import { InboxService } from './pages/inbox/inbox.service';
import { ExportService, ReportService, UtilityService, WindowRefService,
  PagingService, TableHeaderService, ObserverService } from './shared/services/services-index';
import { LabelFormatService } from './shared/services/label-format.service';
import { SelectedChartStateService } from './shared/services/selected-chart-state.service';
import { ModalPopupService } from './shared/services/modal-popup.service';
import { RtmsConstantService } from './shared/services/rtms-constant.service';
import { FilterStateService } from './shared/services/filter-state.service';
import { DataService } from './shared/services/data.service';
import { UtilizationMetricsService } from './shared/analytics/utilization-metrics.service';
import { UserActivityService } from './shared/analytics/user-activity.service';
import { QmReportService } from './shared/services/portal/qmReport.service';
import { RehospDashboardService } from './shared/services/portal/rehospDashboard.service';
import { DashboardDataService } from './shared/services/portal/dashboardData.service';
import { LookUpDataService } from './shared/services/portal/lookUpData.service';
import { ApplicationInfoService } from './shared/services/portal/applicationInfo.service';
import { FeatureService } from './shared/services/feature.service';
import { NotificationService } from './pages/notification/notification.service';
import { UserAdminService } from './shared/services/portal/userAdmin.service';
import { UserSettingService } from './shared/services/portal/userSetting.service';
import { NavigationService } from './shared/services/portal/navigation.service';
import { DirectUrlStateService } from './shared/services/portal/directUrlState.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from './pages/login/login.service';
import { PrincipalService } from './shared/services/portal/principal.service';
import { FilterDashboardService } from './shared/services/portal/filter-dashboard.service';
import { AuthorizationService } from './shared/services/portal/authorization.service';
import { ApplicationInitializationService } from './shared/services/portal/applicationInitialization.service';
import { CardFilterStateService } from './shared/services/card-filter-state.service';
import { SelectedChartService } from './shared/services/selected-chart.service';
import { GenericDashboardFilterService } from './shared/services/portal/genericDashboardFilter.service';
import { UserOrganizationService } from './shared/services/user/user-organization/user-organization.service';
import { ReportDataFilterStateService } from './shared/services/report-data-filter-state.service';
import { ApplicationInsightsService } from './shared/services/application-insights.service';
import { DocumentsDataService } from './shared/services/portal/documentsData.service';

@NgModule({
  providers: [
    FeedbackService,
    InboxService,
    ExportService,
    ReportService,
    UtilityService,
    WindowRefService,
    LabelFormatService,
    SelectedChartStateService,
    ModalPopupService,
    RtmsConstantService,
    FilterStateService,
    DataService,
    WindowRefService,
    UtilizationMetricsService,
    UserActivityService,
    QmReportService,
    FilterDashboardService,
    RehospDashboardService,
    DashboardDataService,
    LookUpDataService,
    ApplicationInfoService,
    FeatureService,
    NotificationService,
    UserAdminService,
    UserSettingService,
    NavigationService,
    DirectUrlStateService,
    ToastrService,
    LoginService,
    PrincipalService,
    AuthorizationService,
    ApplicationInitializationService,
    FilterDashboardService,
    CardFilterStateService,
    PagingService,
    TableHeaderService,
    SelectedChartService,
    GenericDashboardFilterService,
    UserOrganizationService,
    ReportDataFilterStateService,
    ObserverService,
    ApplicationInsightsService,
    DocumentsDataService
  ]
})
export class ServiceModule { }
