import { UserOrganization } from './user-organization.model';

export interface UserModel {
  userId: number;
  UserId?: number;
  FirstName: string;
  LastName: string;
  TimeZoneId: number;
  TimeZone?: any;
  EmailId: string;
  EmailAddress?: string;
  DashboardType: string;
  IsCorporateUser: boolean;
  IsDeleted?: boolean;
  OrganizationId: number;
  OrganizationName: string;
  IsSSO: boolean;
  UserName: string;
  ReceptiveIoConfiguration: any;
  StaffTypeId?: number;
  StaffType?: any;
  DefaultClinicalReport?: string;
  DefaultDashboard?: number;
  DefaultFinancialReport?: string;
  FullUserName?: string;
  UserOrganizations?: UserOrganization[];
  HasAdditionalOrganizations: boolean;
  OrganizationNameAbbrev: string;
}

