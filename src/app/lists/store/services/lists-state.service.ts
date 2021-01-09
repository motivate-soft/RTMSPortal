import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { List } from 'linqts';
import { getSingle, getStream, setValue } from '../../../store/services/storeServiceHelper';
import { ListsState } from '../../store/states/lists-state';
import {
  getReportGroups, getQMLists, getUserHSOrg, getUserFacilities, getReportEnums,
  getUserOrganizations, getOrganizationTypes, getUnits, getPayers, getCategories, getDashboards
} from '../../store/selectors';
import {
  SetReportGroupsAction, SetQmTypesAction, SetUserHSOrganizationAction, SetUserFacilitiesAction,
  SetReportEnumsAction, SetUserOrganizationsAction, SetOrganizationTypesAction,
  SetUnits, SetPayers, SetCategories, SetDashboards
} from '../../store/actions';
import {
  OrganizationModel, QMType, EnumValue,
  FacilityUnit, Payer, Category, SelectOption
} from '../../../shared/models/models-index';
import { RtmsConstantService } from '../../../shared/services/rtms-constant.service';
import { Dashboard } from 'src/app/shared/models/dashboard';
import { StateService } from '@uirouter/core';

@Injectable()
export class ListsStateService {
  constructor(private store: Store<ListsState>, private rtsmConstantService: RtmsConstantService,
    private stateService: StateService) { }

  public getReportGroups = getSingle(this.store, getReportGroups);
  public getReportGroupsStream = getStream(this.store, getReportGroups);
  public getUserHSOrganization = getSingle(this.store, getUserHSOrg);
  public getUserHSOrganizationStream = getStream(this.store, getUserHSOrg);

  public getQMs = getSingle(this.store, getQMLists);
  public getQMsStream = getStream(this.store, getQMLists);

  public getUserFacilitiesStream = getStream(this.store, getUserFacilities);

  public getReportEnums = getSingle(this.store, getReportEnums);
  public getReportEnumsStream = getStream(this.store, getReportEnums);

  public getUserOrganizations = getSingle<any, OrganizationModel[]>(this.store, getUserOrganizations);
  public getUseOrganizationsStream = getStream(this.store, getUserOrganizations);

  public getOrganizationTypes = getSingle(this.store, getOrganizationTypes);
  public getOrganizationTypesStream = getStream(this.store, getOrganizationTypes);

  public getUnits = getSingle<any, FacilityUnit[]>(this.store, getUnits);
  public getUnitsStream = getStream<any, FacilityUnit[]>(this.store, getUnits);

  public getPayers = getSingle<any, Payer[]>(this.store, getPayers);
  public getPayersStream = getStream<any, Payer[]>(this.store, getPayers);

  public getCategories = getSingle<any, Category[]>(this.store, getCategories);
  public getCategoriesStream = getStream<any, Category[]>(this.store, getCategories);

  public getDashboards = getSingle<any, Dashboard[]>(this.store, getDashboards);
  public getDashboardsStream = getStream<any, Dashboard[]>(this.store, getDashboards);

  public setReportGroups = (reportGroups: EnumValue[]) => setValue(this.store, SetReportGroupsAction, reportGroups);
  public setUserHSOrganization = (userHSOrg: OrganizationModel[]) => setValue(this.store, SetUserHSOrganizationAction, userHSOrg);

  public getReportGroupByName(name: string): EnumValue {
    let reportGroup: EnumValue;
    const reportGroupEnums = this.getReportGroups();
    reportGroupEnums.forEach((data, key) => {
      if (data.Name == name) {
        reportGroup = data;
      }
    });
    return reportGroup;
  }

  public getReportGroupById(id: number): EnumValue {
    let reportGroup: EnumValue;
    const reportGroupEnums = this.getReportGroups();
    reportGroupEnums.forEach((data, key) => {
      if (data.Id == id) {
        reportGroup = data;
      }
    });
    return reportGroup;
  }
  public setQMs = (qmLists: QMType[]) => setValue(this.store, SetQmTypesAction, qmLists);
  public setUserFacilities = (userFacilities: OrganizationModel[]) => setValue(this.store, SetUserFacilitiesAction, userFacilities);

  public getUserFacilities(includeCorp?: boolean): Array<OrganizationModel> {
    let lstUserFacilities = new Array() as Array<OrganizationModel>;

    const userFacilitiesData = getSingle(this.store, getUserFacilities)();
    if (!includeCorp) {
      lstUserFacilities = new List<OrganizationModel>(userFacilitiesData).Where(a => a.OrganizationType ==
        this.rtsmConstantService.organizationTypes.Facility).ToArray();
    } else {
      lstUserFacilities = userFacilitiesData;
    }
    lstUserFacilities.sort(function (a, b) {
      return a.OrganizationName.localeCompare(b.OrganizationName);
    });

    return lstUserFacilities;
  }
  public setReportEnums = (reportEnums: EnumValue[]) => setValue(this.store, SetReportEnumsAction, reportEnums);
  public getReportEnumByName(name: string): EnumValue {
    let reportEnum: EnumValue;
    const reportEnums = this.getReportEnums();
    reportEnums.forEach((data, key) => {
      if (data.Name == name) {
        reportEnum = data;
      }
    });
    if (!reportEnum) {
      throw new Error('Report enum not found : ' + name);
    }
    return reportEnum;
  }
  public setUserOrganizations = (userOrg: OrganizationModel[]) => setValue(this.store, SetUserOrganizationsAction,
    userOrg.sort(function (a, b) {
      return a.OrganizationName.localeCompare(b.OrganizationName);
    }))

  public setOrganizationTypes = (organizationTypes: EnumValue[]) => setValue(this.store, SetOrganizationTypesAction, organizationTypes);

  public getOrganizationTypeIdByName(type: string): number {
    const orgTypes = new List<EnumValue>(this.getOrganizationTypes());
    return orgTypes.Where(a => a.Name === type).First().Id;
  }

  public getTypes(): SelectOption[] {
    const types: SelectOption[] = [];
    types.push({ id: 'I', label: 'Immediate' });
    types.push({ id: 'D', label: 'Daily' });
    return types;
  }
  public getStay(): SelectOption[] {
    const stay: SelectOption[] = [];
    stay.push({ id: 1, label: 'Short' });
    stay.push({ id: 2, label: 'Long' });
    return stay;
  }

  public getUserStatus(): SelectOption[] {
    const userStatus: SelectOption[] = [];
    userStatus.push({ id: '1', label: 'Active' });
    userStatus.push({ id: '2', label: 'Inactive' });
    return userStatus;
  }
  public setUnits = (units: FacilityUnit[]) => setValue(this.store, SetUnits, units);
  public setPayers = (payers: Payer[]) => setValue(this.store, SetPayers, payers);
  public setCategories = (categories: Category[]) => setValue(this.store, SetCategories, categories);
  public setDashboards = (dashboards: Dashboard[]) => setValue(this.store, SetDashboards, dashboards);

  public getDashboardIdByNameAndCategory(route: string, category: string): number {
    const dashboards = new List<Dashboard>(this.getDashboards());
    return dashboards.Where(a => a.DashboardRoute === route && a.Category === category).FirstOrDefault().DashboardId;
  }

  public getDashboardById(Id: number): Dashboard {
    const dashboards = new List<Dashboard>(this.getDashboards());
    const dashboard: Dashboard = dashboards.Where(a => a.DashboardId === Id).FirstOrDefault();
    if (!dashboard) {

      throw new Error('Dashboard not found : ' + name);
    }
    return dashboard;
  }

  public getOrganizationIdByName(name: string): number {
    const organizationId = 0;
    const organization = this.getUserOrganizations().find(o => o.OrganizationName === name);
    if (organization) {
      return organization.OrganizationId;
    }
    return organizationId;
  }

  public getDashboardByName(name: string): Dashboard {
    const dashboards = new List<Dashboard>(this.getDashboards());
    const dashboard: Dashboard = dashboards.Where(a => a.DashboardName === name).FirstOrDefault();
    if (!dashboard) {
      throw new Error('Dashboard not found : ' + name);
    }
    return dashboard;
  }

  public getOrganizationsForDropDown(): OrganizationModel[] {
    switch (this.stateService.current.name) {
      case 'home.hs': {
        return this.getUserHSOrganization();
      }
      case 'home.enterpriseProactDashboard':
      case 'home.enterpriseFinancialDashboard':
      case 'home.enterpriseClinicalDashboard':
      case 'home.enterprisePDPMDashboard' : {
        const data = this.getUserOrganizations();
        return data.filter(x => x.OrganizationType === 2 || x.OrganizationType === 3 || x.OrganizationType === 6);
      }
      case 'home.reportDashboard': {
        if (this.stateService.params.category === 'reports-hs') {
          return this.getUserHSOrganization();
        }
      }
      default: {
        return this.getUserFacilities();
      }
    }
  }
}
