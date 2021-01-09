import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { FeatureService } from '../../services/feature.service';
import { StateService } from '@uirouter/core';
import { UserOrganizationEditComponent } from '../user/user-organization/user-organization-edit.component';
import { UserModel } from '../../models/user.model';
import { LoginService } from 'src/app/pages/login/login.service';
import { AuthorizationService } from '../../services/portal/authorization.service';
import { NavigationService } from '../../services/portal/navigation.service';
import { UIEventTypes } from '../../enums/ui-event-types';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { UINotifierService } from '../../services/public/uinotifier.service';
import { map } from 'rxjs/operators';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';

declare let $: any;


@Component({
  selector: 'rtms-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent extends BaseComponent implements OnInit, OnDestroy {
  _collapseDashboard = false;
  _collapseReports = true;
  _collapseAgents = true;
  _isSidebarExpanded = false;
  _realTimeLiteEnabled = false;
  _inboxEnabled = false;
  _documentationEnabled = false;
  _portalUserAdminEnabled = false;
  _financialDashboardEnabled = false;
  _clinicalDashboardEnabled = false;
  _rehospEnabled = false;
  _healthSystemEnabled = false;
  _enterpriseDashboardEnabled = false;
  _enterpriseFinancialDashboardEnabled = false;
  _enterpriseClinicalDashboardEnabled = false;
  _enterpriseProACTDashboardEnabled = false;
  _enterprisePDPMDashboardEnabled = false;
  _adminReportsEnabled = false;
  _facPortalUsageReportEnabled = false;
  _facUtilizationScoreCard = false;
  _portalUsageReportEnabled = false;
  _keywordReportEnabled = false;
  _careTransitionsDashboardEnabled = false;
  _residentDashboardEnabled = false;
  _infectionControlDashboardEnabled = false;
  _reportsEnabled = false;
  _hospitalDashboardEnabled = false;
  _pdpmDashboardEnabled = false;
  _userName = '';
  _loggedInUser = null;
  _version = '';
  _showSideBar = false;
  _hideSideBarMenu = false;
  _currentYear = new Date().getFullYear();
  _collapseEnterpriseDashboards = true;
  _showSwitchOrgIcon = false;
  _userModel: UserModel;

  @ViewChild('userOrgEditModal', { static: false })
  private userOrgEditModal: UserOrganizationEditComponent;

  constructor(
    private _userInterfaceStateService: UserInterfaceStateService,
    private _userStateService: UserStateService,
    private _filtersService: FiltersService,
    private _featureService: FeatureService,
    private _stateService: StateService,
    private _loginService: LoginService,
    private userInterfaceStateService: UserInterfaceStateService,
    private authorizationFactory: AuthorizationService,
    private navigationService: NavigationService,
    private _uiNotifierService: UINotifierService,
    private listsStateService: ListsStateService
  ) {
    super();
    this.subscriptions.push(_userInterfaceStateService.getVersionStream().subscribe(version => {
      if (version) {
        this._version = version;
      }
    }));

    this.subscriptions.push(_userInterfaceStateService.getShowSideBarStream().subscribe(showSideBar => {
      setTimeout(() => {
        this._showSideBar = showSideBar;

      });
    }));

    this.subscriptions.push(_userInterfaceStateService.getHideSideBarMenuStream().subscribe(hideSideBarMenu => {
      setTimeout(() => {
        this._hideSideBarMenu = hideSideBarMenu;
      });
    }));

    this.subscriptions.push(_userInterfaceStateService.getIsSideBarExpandedStream().subscribe(isSidebarExpanded => {
      setTimeout(() => {
        this._isSidebarExpanded = isSidebarExpanded;
      });
    }));

    this.subscriptions.push(_userStateService.getLoggedInUserStream()
      .subscribe(user => {
        if (user) {
          this._loggedInUser = user;
          this._userModel = user;
          this._showSwitchOrgIcon = user.HasAdditionalOrganizations;
          if (user.FirstName === null || user.LastName === null) {
            this._userName = user.EmailId;
          } else {
            this._userName = user.FirstName + ' ' + user.LastName;
          }
        }
      }));

    this.subscriptions.push(this._filtersService.organizations.getOrganizationFeatureStream()
      .subscribe(organizations => {
        if (organizations && organizations.length > 0) {
          const facility = organizations[0];
          this._realTimeLiteEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Limited.Dashboard');
          this._inboxEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Inbox');
          this._documentationEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Documentation');
          this._portalUserAdminEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'PortalUserAdmin');
          this._financialDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Financial.Dashboard');
          this._clinicalDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Clinical.Dashboard');
          this._rehospEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'REHOSPITALIZATION');
          this._healthSystemEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'HealthSystem');
          this._enterpriseDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Enterprise.Dashboard');

          this._enterpriseFinancialDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Enterprise.Financial.Dashboard');
          this._enterpriseClinicalDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Enterprise.Clinical.Dashboard');
          this._enterpriseProACTDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Enterprise.ProACT.Dashboard');
          this._enterprisePDPMDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Enterprise.PDPM.Dashboard');

          this._adminReportsEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Admin.Reports');
          this._facPortalUsageReportEnabled =
            this._featureService.isFeatureEnabledForFacility(facility, 'Admin.Reports.FacilityPortalUsage');
          this._facUtilizationScoreCard =
            this._featureService.isFeatureEnabledForFacility(facility, 'Admin.Reports.UtilizationScoreCard');
          this._portalUsageReportEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Admin.Reports.PortalUsage');
          this._keywordReportEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Admin.Reports.KeywordReport');
          this._hospitalDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Hospital.Dashboard');
          this._reportsEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Reports');
          this._careTransitionsDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'CareTransitions.Dashboard');
          this._residentDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'Resident.Dashboard');
          this._pdpmDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'PDPM.Dashboard');
          this._infectionControlDashboardEnabled = this._featureService.isFeatureEnabledForFacility(facility, 'InfectionControl.Dashboard');
        }
      }));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  toggleCollapse(): void {
    this._isSidebarExpanded = !this._isSidebarExpanded;
    this._userInterfaceStateService.setIsSideBarExpanded(this._isSidebarExpanded);
    if (this._isSidebarExpanded) {
      $('body').removeClass('left-side-collapsed');
    } else {
      $('body').addClass('left-side-collapsed');
    }
  }

  toggleMenuIcon(item: string): void {
    switch (item) {
      case 'Dashboards':
        this._collapseDashboard = !this._collapseDashboard;
        break;
      case 'adminReports':
        this._collapseReports = !this._collapseReports;
        break;
      case 'Agents':
        this._collapseAgents = !this._collapseAgents;
        break;
      case 'enterpriseDashboards':
        this._collapseEnterpriseDashboards = !this._collapseEnterpriseDashboards;
        break;
      default:
        break;
    }
  }

  toggleHighlightedLink(route: string): string {
    if (this._userInterfaceStateService.getToState() && this._userInterfaceStateService.getToState().name) {
      return this._userInterfaceStateService.getToState().name === route ? 'selected' : '';
    } else {
      return '';
    }
  }

  navigate(to: any, dashboardId: number): void {
    if (dashboardId) {
      this._stateService.transitionTo(to, { dashboardId: dashboardId });
      return;
    }
    this._stateService.transitionTo(to);
    this._isSidebarExpanded = this._isSidebarExpanded;
    if (this._isSidebarExpanded) {
      ($('#sidebar-collapse') as any).collapse();
    }
  }

  showSwitchOrgModal(): void {
    this.userOrgEditModal.open(this._userModel);
  }

  handleUserOrgEditFinished(organizationId: number) {
    if (this._userModel.OrganizationId === organizationId) return;

    // need to get the user's info again, since their organization has changed
    this._loginService.getUserInformation()
      .pipe(
        map(userInfo => {
          this._loginService.setUserSession(userInfo);
          return userInfo;
        })
      ).subscribe((userInfo: any) => {
        let orgs = this.listsStateService.getOrganizationsForDropDown();
        if (orgs && orgs.length) {
          const uiEvents = {
            type: UIEventTypes.ChangeFacility,
            value: orgs[0]
          } as PortalUIEvent;
          this._uiNotifierService.publishEvents(uiEvents);
        }
      });
  }
}
