import { loggedInUserAction, LOGGED_IN_USER } from '.';
import { UserModel } from '../../../shared/models/user.model';

describe('Set Logged In User Action', () => {
  const user: UserModel = {
    userId: 1,
    FirstName: 'John',
    LastName: 'Doe',
    TimeZoneId: 1,
    DashboardType: 'financial',
    EmailId: 'a@a.com',
    IsCorporateUser: false,
    IsSSO: false,
    OrganizationId: 1,
    UserName: 'duser',
    ReceptiveIoConfiguration: { VendorId: 1, Secret: 1 }
  };

  const action = loggedInUserAction(user);

  it('should create action for passed user', () => {
    expect(action.type).toBe(`SET_VALUE_${LOGGED_IN_USER}`);
  });

  it('should set user value action payload', () => {
    expect(action.actionValue).toBe(user);
  });
});
