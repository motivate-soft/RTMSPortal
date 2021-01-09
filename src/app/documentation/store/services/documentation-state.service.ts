import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DocumentationState } from '../states/documentation-state';
import { getSingle, getStream, setValue } from '../../../store/services/storeServiceHelper';
import { getDirectoryDrillDownHistory } from '../selectors/index';
import { directoryDrilldownHistoryAction } from '../actions';
import { Directory } from 'src/app/shared/models/directory';
import * as _ from 'lodash';

@Injectable()
export class DocumentationStateService {
  constructor(private store: Store<DocumentationState>) { }

  public getDirectoryDrillDownHistory = getSingle(this.store, getDirectoryDrillDownHistory);
  public getDirectoryDrillDownHistoryStream = getStream(this.store, getDirectoryDrillDownHistory);

  addDirectoryDrillDownHistory(directory) {
    let drilldownHistory: Directory[] = this.getDirectoryDrillDownHistory();
    if (_.findIndex(drilldownHistory, x => x.Path === directory.Path) === -1) {
      drilldownHistory.push({
        Name: directory.Name ? directory.Name : 'Home',
        Path: directory.Path
      });
      this.setDirectoryDrillDownHistory([...drilldownHistory]);
    }
  }

  navigateBack(directory) {
    let drilldownHistory: Directory[] = this.getDirectoryDrillDownHistory();
    drilldownHistory.length = _.findIndex(drilldownHistory, x => x.Path === directory.Path) + 1;
    this.setDirectoryDrillDownHistory([...drilldownHistory]);
  }

  public clearDirectoryDrillDownHistory() {
    this.setDirectoryDrillDownHistory([]);
  }

  private setDirectoryDrillDownHistory = (directoryDrillDownHistory: Directory[]) =>
    setValue(this.store, directoryDrilldownHistoryAction, directoryDrillDownHistory)
}
