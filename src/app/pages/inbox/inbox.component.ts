import { Component,Pipe } from '@angular/core';
import { InboxModel,InboxGroupModel,OrganizationModel } from 'src/app/shared/models/models-index';
import { InboxService } from 'src/app/pages/inbox/inbox.service';
import { ExportService,ReportService } from 'src/app/shared/services/services-index';
import { UserStateService } from '../../user/store/services/user-state.service';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';

@Pipe({
    name: 'groupFilter',
    pure: false
})
@Component({
    selector: 'rtms-inbox',
    templateUrl: './inbox.component.tpl.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
    
    constructor(
        private _inboxService: InboxService,
        private _reportService: ReportService,
        private _exportService: ExportService,
        private _userStateService: UserStateService,
        private _utilizationMetricsService: UtilizationMetricsService
    ) {
        this.loadGroupsArray();
        this.getScheduledReportsData();    
    }

    _searchText='';
    _expanded=true;
    private _gridData: Array<InboxModel> = [];
    public _groups: Array<InboxGroupModel>= [];


    loadGroupsArray(): any {
        this._groups = [];
        this._groups.push(new InboxGroupModel('Today',1,true));
        this._groups.push(new InboxGroupModel('Last 7 Days',2,true));
        this._groups.push(new InboxGroupModel('Older',3,true));
    }
    
    get visibleGroups() {
        return this._groups.filter( x => x.Hide===false);
      }

    protected getScheduledReportsData(): void {
        this._gridData = [];

        this._inboxService.getScheduledReports().then(
            res => {
                this._gridData = res;
                let groups = this._groups;
                this._gridData.forEach(function (report) {
                    groups.filter( x => x.Id===report.InboxGroup)[0].Hide=false;
                });
                this.removeGroupsWithNoItems();
            }
        );
    }

    protected removeGroupsWithNoItems(): any {
        for(var i = this._groups.length -1; i >= 0 ; i--){
            if(this._groups[i].Hide){
                this._groups.splice(i, 1);
            }
        }
    }

    protected filterInbox(event: any) { 
        this._gridData = this._gridData.filter((listing: any) => listing.DisplayName === event.target.value);
        console.log(event.target.value);
    }

    protected getReport(model:InboxModel ): void {
        this._utilizationMetricsService.recordInboxActivity (model.ReportId, model.ReportScheduleHistoryId);

        this._reportService.getReportById(model.ReportId).then(
            res => {
                const report = res; 

                var org = new OrganizationModel();
                
                org.OrganizationId= model.OrganizationId,
                org.OrganizationName =model.OrganizationName;

                var user = this._userStateService.getLoggedInUser();
                var filter = { UserTimeZoneId: user.TimeZoneId,ReportScheduleHistoryId: model.ReportScheduleHistoryId };
                this._exportService.downloadScheduledReport(report,filter,org);
            }
        );
    }

}