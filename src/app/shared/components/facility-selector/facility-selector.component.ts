import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ListsStateService } from 'src/app/lists/store/services/lists-state.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../base.component';
import { UINotifierService } from '../../services/services-index';
import { UIEventTypes } from '../../enums/ui-event-types';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { OrganizationModel } from '../../models/models-index';

@Component({
  selector: 'rtms-facility-selector',
  template: `
<div class="pull-right header-selector header-selector-size care-transition-contorl-size">
          <ng-select [items]="_facilities"
                     [clearable]="false"
                     bindLabel="OrganizationName"
                     autofocus
                     bindValue="OrganizationId"
                     [(ngModel)]="_selectedOrgId"
                     (change)="onItemSelect($event)"
                     class="custom">
                  <ng-template ng-label-tmp let-item="item">
                    <span *ngIf="item.OrganizationType > 1">
                      {{item.OrganizationName}} - {{item.OrganizationTypeName}}
                    </span>
                    <span *ngIf="item.OrganizationType === 1">
                      {{item.OrganizationName}}
                    </span>
                  </ng-template>
                  <ng-template ng-option-tmp let-item="item">
                    <span *ngIf="item.OrganizationType > 1">
                      {{item.OrganizationName}} - {{item.OrganizationTypeName}}
                    </span>
                    <span *ngIf="item.OrganizationType === 1">
                      {{item.OrganizationName}}
                    </span>
                  </ng-template>
          </ng-select>
      </div>
		`,
  styleUrls: ['./facility-selector.component.scss']
})
export class FacilitySelectorComponent extends BaseComponent implements OnInit {

  constructor(
    private _listsStateService: ListsStateService,
    private _filterService: FiltersService,
    private _uiNotifierService: UINotifierService
  ) {
    super();
    this.subscriptions.push(this._filterService.organizations.getStream()
      .subscribe(val => {
        setTimeout(() => {
          if (val && val.length > 0) {
            this.setSelectedValue();
          }
        });
      }));
    this.subscriptions.push(this._listsStateService.getUseOrganizationsStream()
      .subscribe(organizations => {
        this.loadDropdownValues();
      }));
  }

  @Input() displayMode: string;
  @ViewChild(NgSelectComponent, { static: false })
  ngSelect: NgSelectComponent;
  _facilities: Array<any> = [];
  _selectedOrgId: number;

  ngOnInit() {
    this.loadDropdownValues();
    this.setSelectedValue();
  }



  setSelectedValue() {
    switch (this.displayMode) {
      case 'hs': {
          if (this._filterService.selectedHsOrganization.get()) {
            this._selectedOrgId = this._filterService.selectedHsOrganization.get().OrganizationId;
          } else {
            this._selectedOrgId = this._facilities[0].OrganizationId;
          }

          break;
        }
      case 'enterprise': {
          if (this._filterService.selectedEnterpriseOrganization.get()) {
            this._selectedOrgId = this._filterService.selectedEnterpriseOrganization.get().OrganizationId;
          } else {
            this._selectedOrgId = this._facilities[0].OrganizationId;
          }
          break;
        }
      default: {
        this._selectedOrgId = this._filterService.organizations.get()[0].OrganizationId;
        break;
      }
    }
  }

  setSelectedFacility(org: any) {
    this._selectedOrgId = org.OrganizationId;

    switch (this.displayMode) {
      case 'hs': {
          this._filterService.selectedHsOrganization.set(org);
          break;
        }
      case 'enterprise': {
          this.publishFacilityChangeEvent(org);
          break;
        }
      default: {
        this.publishFacilityChangeEvent(org);
        break;
      }
    }
  }

  publishFacilityChangeEvent(org: OrganizationModel) {
    const uiEvents = {
      type: UIEventTypes.ChangeFacility,
      value: org
    } as PortalUIEvent;
    this._uiNotifierService.publishEvents(uiEvents);
  }

  loadDropdownValues() {
    this._facilities = this._listsStateService.getOrganizationsForDropDown();
  }

  onItemSelect(org: any) {
    this.setSelectedFacility(org);
  }

}
