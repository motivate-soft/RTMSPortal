import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/portal/dashboard.service.';
import { ResidentModel } from '../../models/resident';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { OrganizationModel, SelectOption } from '../../models/models-index';
import { BaseComponent } from '../base.component';
import { UtilizationMetricsService } from 'src/app/shared/analytics/utilization-metrics.service';

@Component({
  selector: 'rtms-resident-pager',
  templateUrl: './resident-pager.component.html',
  styleUrls: ['./resident-pager.component.scss'],
})
export class ResidentPagerComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() showRoomBedSort: boolean;

  constructor(
    private _dashboardService: DashboardService,
    private _filterService: FiltersService,
    private _utilizationMetricsService: UtilizationMetricsService,
  ) {
    super();
    this.subscriptions.push(_filterService.organizations.getStream()
      .subscribe(val => {

          if (val && this._currentOrganization && val[0].OrganizationId !== this._currentOrganization.OrganizationId) {
            this._currentResident = null;
            this.getResidents();
          }

          if (val) {
            this._currentOrganization = val[0];
          }
      }));
  }

  @Input() runOutsideAngular = true;

  @ViewChild(NgSelectComponent, {static: false})
  ngSelect: NgSelectComponent;

  _currentResident: ResidentModel;
  _currentOrganization: OrganizationModel;
  _residents: Array<ResidentModel> = [];
  _selectedResMRN: string;
  _residentSortBy: SelectOption[] = [];
  _selectedResidentSortBy: any;
  settings = {};

  ngOnInit() {
    this.loadCustomSortOptions();
    this.getResidents();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.setResidentValueInFilterStore(null);
  }

  onItemSelect(item: any) {
    this.setCurrentResident(item);
  }

  onChangeSort(item: any) {
    this._selectedResidentSortBy = item.id;
    this._currentResident = null;
    this.getResidents();
  }

  public loadCustomSortOptions(): void {
    this._residentSortBy.push({ id: '0', label: 'Sort Resident' });
    this._residentSortBy.push({ id: '1', label: 'Sort Room/Bed' });

    this._selectedResidentSortBy = '0';
  }

  protected setCurrentResident(res: ResidentModel): void {
    this.setResidentValueInFilterStore(res.ResMRN);
    this._currentResident = res;
    this._selectedResMRN = res.ResMRN;
    this._utilizationMetricsService.recordResidentChange(res.ResMRN);
  }

  public getNextResident(): void {
    if (this.isNextDisabled()) { return; }

    if (! this._currentResident) {
      let res = new ResidentModel();
      res = this._residents.find(x => x.RowId === 1);
      this.setCurrentResident(res);
    } else {
      this.setCurrentResident(this._residents.find(x => x.RowId === this._currentResident.RowId + 1));
    }
  }

  public getPreviousResident(): void {
    if (this.isPreviousDisabled()) { return; }

    if (this._currentResident == null) {
      this.setCurrentResident(this._residents[0]);
    } else {
      this.setCurrentResident(this._residents.find(x => x.RowId === this._currentResident.RowId - 1));
    }
  }

  public isPreviousDisabled(): boolean {
    return this._currentResident && this._currentResident.RowId === 1;
  }

  public isNextDisabled(): boolean {
    return this._currentResident && this._currentResident.RowId >= this._residents.length;
  }

  getResidents(): void {
    const filter = {
      OrganizationId: this._filterService.organizations.getFirstOrDefault().OrganizationId,
      Units: this._filterService.getUnitIdCSV(),
      Payers: this._filterService.getPayersIdCSV(),
      ResidentDashboardSortBy: this._selectedResidentSortBy
    };

    this._dashboardService.getDataFromApi(filter, 'resident/resident-dashboard-get-all').then
    (
        res => {
          const temp = Array<ResidentModel>();
          const sortedByRoom = this._selectedResidentSortBy === '1';
          let rowId = 1;

          res.forEach(function (value: { ResMRN: string; ResNameF: string; ResNameL: string; Resident: string; RoomBed: string }) {
            const res = new ResidentModel();

            res.ResMRN = value.ResMRN;
            res.ResNameF = value.ResNameF;
            res.ResNameL = value.ResNameL;

            if (sortedByRoom) {
              let roomBed = value.RoomBed;

              if (! value.RoomBed || value.RoomBed === '') {
                roomBed = 'N/A';
              }

              res.Resident = roomBed + ' ' + value.Resident;
            } else {
              res.Resident = value.Resident;
            }

            res.RowId = rowId;
            temp.push(res);

            rowId++;
          });

          this._residents = temp;

          if (this._residents.length === 0) {
            this.handleNoResidents();
          } else {
            this.getNextResident();
          }
        }
    );
  }
  handleNoResidents(): any {
    if ( this._residents.length === 0) {
        this.setResidentValueInFilterStore('');
      }
    this._currentResident = null;
    this._selectedResMRN = '';
  }

  private setResidentValueInFilterStore(resMRN: string) {
    const filterSettings = this._filterService.filterSettings.get();
    filterSettings.ResMRN = resMRN;
    this._filterService.filterSettings.set(filterSettings);
  }
}
