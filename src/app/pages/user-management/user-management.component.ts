import { Component, ViewChild, TemplateRef } from '@angular/core';
import { UserModel, User } from 'src/app/shared/models/models-index';
import { UserAdminService } from 'src/app/shared/services/portal/userAdmin.service';
import { GridColumn } from 'src/app/shared/components/rtms-grid-v2/grid-column';
import { TemplateColumn } from 'src/app/shared/components/rtms-grid-v2/template-column';
import { StateService } from '@uirouter/core';
import { LinkColumn } from 'src/app/shared/components/rtms-grid-v2/link-column';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportableDirective } from 'src/app/shared/directives/exportable.directive';
import { ReportService, ExportService } from 'src/app/shared/services/services-index';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';

@Component({
    selector: 'rtms-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent {
    public _gridDataFromAPI: Array<UserModel> = [];
    public _gridData: Array<UserModel> = [];
    public _gridColumns: Array<GridColumn>;
    public _showDeleted = true;
    public _reportId: number;
    public _currentUser: User;
    public _chartName = 'User Management';

    @ViewChild('itemTemplateForToggleUser', {static: true}) itemTemplateForToggleUser: TemplateRef<any>;
    @ViewChild('deactivateUserModal', {static: false}) public deactivateUserModal: TemplateRef<any>;

    constructor(
        private modalService: NgbModal,
        private _userAdminService: UserAdminService,
        private _stateService: StateService,
        private _listsStateService: ListsStateService,
        private _reportService: ReportService,
        private _utilizationMetricsService: UtilizationMetricsService,
        private _filtersService: FiltersService,
        private _userStateService: UserStateService,
        private _exportService: ExportService
    ) {
      this._reportId = this._listsStateService.getReportEnumByName('UserAdminView').Id;
      this.getUsers();
    }

    ngOnInit() {
      this.FillGridColumn();
    }

    getUsers() {
      this._userAdminService.getUsers().subscribe((response) => {
        this._gridDataFromAPI = response;
        this.loadUsersToGrid();
      });
    }

    toggleDeactiveModel(user: User) {
      this._currentUser = user;
      this.modalService.open(this.deactivateUserModal, { windowClass: 'modal-danger' });
    }

    toggleDeactive() {
      this._userAdminService.toggleActive(this._currentUser.UserId).subscribe(response => {
        this.closeModal();
        this.getUsers();
      });
    }

    toggleActive(user: User) {
      this._userAdminService.toggleActive(user.UserId).subscribe(response => {
        this.getUsers();
      });
    }

    closeModal() {
      if (this.modalService.hasOpenModals()) {
        this.modalService.dismissAll();
      }
    }

    loadUsersToGrid() {
      const newGrid = [];
      this._gridDataFromAPI.forEach(data => {
        const user: UserModel = data as UserModel;
        if ((!user.IsDeleted && ! this._showDeleted) || this._showDeleted) {
          newGrid.push(user);
        }
      });

      this._gridData = newGrid;
    }

    addUser(): void {
      this._stateService.transitionTo('home.userManagementAdd');
    }

    onEditUserData($event): void {
      const user = $event as User;
      this._stateService.transitionTo('home.userManagementEdit', { userId: user.UserId });
    }

    public toggleDisabledUsers() {
      this.loadUsersToGrid();
    }

    private FillGridColumn() {
      const toggleAccount = new TemplateColumn({
        ItemTemplate: this.itemTemplateForToggleUser,
        width: '12%'
      });

      const columns: Array<GridColumn> = [
        new LinkColumn({ headerName: 'Full Name', field: 'FullUserName', Clicked: (user) => { this.onEditUserData(user); } }),
        new GridColumn({ headerName: 'User Name', field: 'UserName'/*, IsSortable: true*/ }),
        new GridColumn({ headerName: 'Email Address', field: 'EmailAddress'/*, IsSortable: true*/ }),
        toggleAccount
      ];

      this._gridColumns = columns;
    }

    public onExport(type: string): void {
      this._utilizationMetricsService.recordExports(this._reportId, this._chartName, type, null);

      this._reportService.getReportById(this._reportId).then(
        res => {
          const report = res;
          const org = this._filtersService.organizations.getFirstOrDefault();
          const user = this._userStateService.getLoggedInUser();
          const filter = { UserTimeZoneId: user.TimeZoneId };
          this._exportService.downloadReport(report, type, this._gridData as any, filter, org);
      }
    );

    }
}
