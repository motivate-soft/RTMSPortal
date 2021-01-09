import { Ng2StateDeclaration, Category, trace } from '@uirouter/angular';
import {
  AuthCallbackComponent, AuthFailureComponent, InboxComponent, LoginComponent, LogoutComponent, LockScreenComponent,
  RequestPasswordResetComponent, PasswordResetComponent, UserSettingsComponent, NoAccessFeatureComponent,
  ReportLandingComponent, ErrorTestComponent, UserManagementComponent, SSOComponent,
    UserManagementAddComponent, GenericDashboardComponent, HelpComponent, TopBarComponent, LogoutSSOComponent, DocumentationComponent
} from './pages';
import { RtmsConstantServiceObj } from './shared/services/rtms-constant.service';
import { HomeComponent } from './home.component';
import { ROUTESREDIRECT } from './app-routes-redirect';
import { FiltersService } from './filter/store/services/filters.service';



const localRoutes: Array<Ng2StateDeclaration> = [
  {
    name: 'home',
    url: '/',
    component: HomeComponent,
    abstract: true
  },
  {
    name: 'authcallback',
    url: '/authcallback',
    component: AuthCallbackComponent,
    data: {
      allowAnonymous: true
    }

  },
  {
    name: 'authfailure',
    url: 'authfailure',
    component: AuthFailureComponent
  },
  {
    name: 'home.inbox',
    url: 'userinbox',
    component: InboxComponent,
    data: {
      requiresFeatures: ['Inbox'],
    }
  },
  {
    name: 'home.documentation',
    url: 'documentation',
    component: DocumentationComponent,
    data: {
      requiresFeatures: ['Documentation'],
    }
  },
  {
    name: 'home.login',
    url: 'login/:slug',
    component: LoginComponent,
    params: {
      loginFailure: false,
      slug: { value: null, squash: true }
    }
  },
  {
    name: 'home.sso',
    url: 'sso',
    component: SSOComponent,
    params: {
      connection: ''
    },
    data: {
      allowAnonymous: true
    }
  },
  {
    name: 'home.logout',
    url: 'logout',
    component: LogoutComponent
  },
  {
    name: 'home.logoutSSO',
    url: 'logout-sso',
    component: LogoutSSOComponent,
    params: {
      loginFailure: false
    }
  },
  {
    name: 'home.lockScreen',
    url: 'lockScreen',
    component: LockScreenComponent
  },
  {
    name: 'home.requestPasswordReset',
    url: 'requestPasswordReset',
    component: RequestPasswordResetComponent
  },
  {
    name: 'home.passwordreset',
    url: 'passwordreset/:token',
    component: PasswordResetComponent
  },
  {
    name: 'home.userSettings',
    url: 'user',
    component: UserSettingsComponent
  },
  {
    name: 'home.userManagement',
    url: 'user-management',
    component: UserManagementComponent
  },
  {
    name: 'home.userManagementAdd',
    url: 'user-management-add',
    component: UserManagementAddComponent
  },
  {
    name: 'home.help',
    url: 'help',
    component: HelpComponent
  },
  {
    name: 'home.userManagementEdit',
    url: 'user-management-edit',
    component: UserManagementAddComponent,
    params: {
      userId: 0
    }
  },
  {
    name: 'home.noFeatureAccess',
    url: 'no-feature-access',
    component: NoAccessFeatureComponent
  },
  {
    name: 'home.errorTest',
    url: 'error-test',
    component: ErrorTestComponent
  },
  {
    name: 'home.reportsLanding',
    url: 'reports',
    component: ReportLandingComponent,
    data: {
      requiresFeatures: ['Reports']/*,
      allowedOrganizationTypes: '1'*/
    }
  },
  {
    name: 'home.genericDashboard',
    url: 'realtime-lite',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'limited',
      category: 'limited'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Limited.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.hospitalDashboard',
    url: 'proact-cm',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'proact-cm',
      category: 'proact-cm'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Hospital.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.careTransitionsDashboard',
    url: 'care-transitions',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'care-transitions',
      category: 'care-transitions',
      delayAPICalls: true
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['CareTransitions.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
        name: 'home.residentDashboard',
        url: 'resident-dashboard',
        component: GenericDashboardComponent,
        params: {
          dashboardName: 'resident-dashboard',
          category: 'resident-dashboard'
        },
        data: {
          noGlobalSpinner: true,
          requiresFeatures: ['Resident.Dashboard'],
          allowedOrganizationTypes: [1]
        }
      } ,
  {
    name: 'home.enterpriseProactDashboard',
    url: 'enterprise-proact',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 600,
      dashboardName: 'enterprise-proact',
      category: 'enterprise-proact'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Enterprise.ProACT.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.enterpriseFinancialDashboard',
    url: 'enterprise-financial',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 700,
      dashboardName: 'enterprise-financial',
      category: 'enterprise-financial'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Enterprise.Financial.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.enterpriseClinicalDashboard',
    url: 'enterprise-clinical',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 800,
      dashboardName: 'enterprise-clinical',
      category: 'enterprise-clinical'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Enterprise.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.hs',
    url: 'hs',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'hs',
      category: 'hs'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['HealthSystem'],
      allowedOrganizationTypes: [RtmsConstantServiceObj.organizationTypes.Facility]
    }
  },
  {
    name: 'home.financial',
    url: 'financial',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'financial',
      category: 'financial'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Financial.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.rehospitalization',
    url: 'rehospitalization',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'proact',
      category: 'proact'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['REHOSPITALIZATION'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.topBar',
    url: 'top-bar',
    component: TopBarComponent
  },
  {
    name: 'home.detailDashboard',
    url: ':category/detail/:dashboardName',
    component: GenericDashboardComponent,
    params: {
      isDetailDashboard: true,
      showBackButton: true
    },
    data: {
      noGlobalSpinner: true,
    }
  },
  {
    name: 'home.reportDashboard',
    url: ':category/:dashboardName',
    component: GenericDashboardComponent,
    params: {
      isReportDashboard: true,
      showBackButton: true
    },
    data: {
      noGlobalSpinner: true,
    }
  },
  {
    name: 'home.pdpm',
    url: 'pdpm',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'pdpm',
      category: 'pdpm'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['PDPM.Dashboard'],
      allowedOrganizationTypes: [1]
    }
  },
  {
    name: 'home.clinical',
    url: 'clinical',
    component: GenericDashboardComponent,
    params: {
      dashboardName: 'clinical',
      category: 'clinical'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Clinical.Dashboard'],
      allowedOrganizationTypes: [RtmsConstantServiceObj.organizationTypes.Facility]
    }
  },
  {
    name: 'home.facilityPortalUsageReport',
    url: 'reports/facility-portal-usage',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 501,
      isAdminReports: true,
      dashboardName: 'facility-portal-usage',
      category: 'reports-admin'

    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Admin.Reports.FacilityPortalUsage', 'Admin.Reports']
    }
  },
  {
    name: 'home.portalUsageReport',
    url: 'reports/portal-usage',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 502,
      isAdminReports: true,
      dashboardName: 'portal-usage',
      category: 'reports-admin'

    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Admin.Reports.PortalUsage', 'Admin.Reports'],
      allowedOrganizationTypes: [RtmsConstantServiceObj.organizationTypes.Facility]
    }
  },
  {
    name: 'home.portal-usage-non',
    url: 'portal-usage-non',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 502,
      isAdminReports: true,
      reverseSort: true,
      dashboardName: 'portal-usage',
      category: 'reports-admin'

    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Admin.Reports.PortalUsage', 'Admin.Reports'],
      allowedOrganizationTypes: [RtmsConstantServiceObj.organizationTypes.Facility]
    }
  },
  {
    name: 'home.keywordReport',
    url: 'reports/keyword',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 503,
      isAdminReports: true,
      dashboardName: 'keyword-report',
      category: 'reports-admin'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Admin.Reports.KeywordReport', 'Admin.Reports']
    }
  },
  {
    name: 'home.utilizationScoreCard',
    url: 'reports/utilization-score-card',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 504,
      isAdminReports: true,
      dashboardName: 'utilization-score-card',
      category: 'reports-admin'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Admin.Reports.UtilizationScoreCard', 'Admin.Reports'],
      allowedOrganizationTypes: RtmsConstantServiceObj.allOrganizationTypes
    }
  },
  {
    name: 'home.enterprisePDPMDashboard',
    url: 'enterprise-pdpm',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 1000,
      dashboardName: 'enterprise-pdpm',
      category: 'enterprise-pdpm'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['Enterprise.Dashboard'],
      allowedOrganizationTypes: RtmsConstantServiceObj.allOrganizationTypes
    }
  },
  {
    name: 'home.infectionControl',
    url: 'infection-control',
    component: GenericDashboardComponent,
    params: {
      dashboardId: 1100,
      dashboardName: 'infection-control',
      category: 'infection-control'
    },
    data: {
      noGlobalSpinner: true,
      requiresFeatures: ['InfectionControl.Dashboard'],
      allowedOrganizationTypes: RtmsConstantServiceObj.allOrganizationTypes
    }
  }
];

export const ROUTES: Array<Ng2StateDeclaration> = [...localRoutes, ...ROUTESREDIRECT];
