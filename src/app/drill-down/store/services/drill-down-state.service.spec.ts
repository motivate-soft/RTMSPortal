import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { DrillDownStateService } from '../../store/services/drill-down-state.service';
import { DrillDownState } from '../../store/states/drill-down-state';
import { ReportInfo } from '../../../shared/models/report-info';
import { reducers } from '../../store/reducers';
import { selectedReportAction, drilldownHistoryAction } from '../../store/actions';
import { FilterSettings } from '../../../shared/models/filter-settings';
import { ChartDetail } from 'src/app/shared/models/chart-details';


describe('DrillDownStateService', () => {
  let service: DrillDownStateService;
  let store: Store<DrillDownState>;
  let selectedReport: ReportInfo;
  const drilldownHistory: ChartDetail[] = [];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          drilldown: combineReducers(reducers)
        })
      ],
      providers: [DrillDownStateService]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    service = TestBed.get(DrillDownStateService);

    selectedReport = {
      chartName: 'Chart 1',
      reportId: 1,
      selectedType: 'Test'
    } as ReportInfo;

    drilldownHistory.push({
      filter: {
        ReportId: 1,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 1
      } as FilterSettings,
      chartName: 'Test Report 1',
      reportId: 1
    } as ChartDetail);

    drilldownHistory.push({
      filter: {
        ReportId: 2,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 1
      } as FilterSettings,
      chartName: 'Test Report2',
      reportId: 2
    } as ChartDetail);

  });

  it('Should add drilldown history', () => {
    const currentDrillDownHistory = {
      filter: {
        ReportId: 22,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 23
      } as FilterSettings,
      chartName: 'Test Report2',
    } as ChartDetail;
    service.addDrillDownHistory(currentDrillDownHistory);
    const getDrillDownHistoryData = service.getDrillDownHistory();
    expect(getDrillDownHistoryData[0]).toBe(currentDrillDownHistory);
  });

  it('Should add drilldown history already exist then update history', () => {
    const currentDrillDownHistory = {
      filter: {
        ReportId: 10,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 12
      } as FilterSettings,
      chartName: 'Test Report2'
    }as ChartDetail;
    service.addDrillDownHistory(currentDrillDownHistory);

    const drillDownHistoryData = {
      filter: {
        ReportId: 100,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 12
      } as FilterSettings,
      chartName: 'Test Report2'
    } as ChartDetail;

    service.addDrillDownHistory(drillDownHistoryData);
    const getDrillDownHistoryData = service.getDrillDownHistory();
    expect(getDrillDownHistoryData[0]).toBe(drillDownHistoryData);
  });

  it('Should add drilldown history not exist then add data in history', () => {
    const currentDrillDownHistory = {
      filter: {
        ReportId: 10,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 12
      } as FilterSettings,
      chartName: 'Test Report2',
      reportId: 10
    } as ChartDetail;
    service.addDrillDownHistory(currentDrillDownHistory);

    const drillDownHistoryData = {
      filter: {
        ReportId: 100,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 12
      } as FilterSettings,
      chartName: 'Test Report23',
      reportId: 100
    } as ChartDetail;

    service.addDrillDownHistory(drillDownHistoryData);
    const getDrillDownHistoryData = service.getDrillDownHistory();
    expect(getDrillDownHistoryData[0]).toBe(currentDrillDownHistory);
    expect(getDrillDownHistoryData[1]).toBe(drillDownHistoryData);

  });

  it('Should clear drilldown history', () => {
    service.clearDrillDownHistory();
    const getDrillDownHistoryData = service.getDrillDownHistory();
    expect(getDrillDownHistoryData.length).toBe(0);
    expect(store.dispatch).toHaveBeenCalledWith(drilldownHistoryAction([]));
  });

  it('Should remove item from drilldown history', () => {
    const currentDrillDownHistory = {
      filter: {
        ReportId: 10,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 12
      } as FilterSettings,
      chartName: 'Test Report2'
    } as ChartDetail;
    service.addDrillDownHistory(currentDrillDownHistory);

    const drillDownHistoryData = {
      filter: {
        ReportId: 100,
        StartDate: new Date(),
        EndDate: new Date(),
        OrganizationId: 12
      } as FilterSettings,
      chartName: 'Test Report23'
    } as ChartDetail;

    service.addDrillDownHistory(drillDownHistoryData);
    service.removeItemFromHistory(0);
    const getDrillDownData = service.getDrillDownHistory();
    expect(getDrillDownData.length).toBe(0);
  });
});
