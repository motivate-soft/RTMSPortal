import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DrillDownState } from '../../store/states/drill-down-state';
import { getSingle, getStream, setValue } from '../../../store/services/storeServiceHelper';
import { getDrillDownHistory } from '../../store/selectors/index';
import { drilldownHistoryAction } from '../../store/actions';
import { ChartDetail } from 'src/app/shared/models/chart-details';

@Injectable()
export class DrillDownStateService {
  constructor(private store: Store<DrillDownState>) { }

  public getDrillDownHistory = getSingle(this.store, getDrillDownHistory);
  public getDrillDownHistoryStream = getStream(this.store, getDrillDownHistory);

  public addDrillDownHistory(item: ChartDetail) {
    const drillDownHistoryData = this.getDrillDownHistory();
    if (drillDownHistoryData.length > 0) {
      drillDownHistoryData.forEach((data, key) => {
        if (data.reportId === item.reportId) {
          drillDownHistoryData.splice(key, 1);
        }
      });
    }
    drillDownHistoryData.push(item);
    const historyData = [...drillDownHistoryData];
    this.setDrillDownHistory(historyData);
  }
  public clearDrillDownHistory() {
    this.setDrillDownHistory([]);
  }
  public removeItemFromHistory(index: number) {
    const drillDownHistoryData = this.getDrillDownHistory();
    for (let i = drillDownHistoryData.length - 1; i >= 0; i--) {
      if (i >= index) {
        drillDownHistoryData.splice(index, 1);
      }
    }
    this.setDrillDownHistory(drillDownHistoryData);
  }
  private setDrillDownHistory = (reportDrillDownHistory: ChartDetail[]) =>
    setValue(this.store, drilldownHistoryAction, reportDrillDownHistory)


}
