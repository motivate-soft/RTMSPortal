import { UserModel } from './models-index';
import { inherit } from '@uirouter/core';

export class User {

  constructor() {
    this.DefaultDashboard = User.DefaultDashboardClinical;
  }

  public static readonly DefaultDashboardClinical = 1;
  userId: Number;  UserId?: number;
  NameFirst: string;
  NameLast: string;
  TimeZoneId: number;
  TimeZone?: any;
  EmailId: string;
  EmailAddress?: string;
  DashboardType: string;
  IsCorporateUser: boolean;
  OrganizationId: number;
  IsSSO: boolean;
  UserName: string;
  ReceptiveIoConfiguration: any;
  StaffTypeId?: number;
  StaffType?: any;
  DefaultClinicalReport?: string;
  DefaultDashboard?: number;
  DefaultFinancialReport?: string;
  Facilities?: any[];
  FullUserName?: string;
  SelectedOrganization?: any;
}
