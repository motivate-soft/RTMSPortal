import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';

export class ChangeEventModel {
  public itemsPerPage:number;
}

@Injectable()
export class ObserverService {

  constructor() { }

  // data fetching observer--------------------------------------------
  /**
   * Data fetching finished
   * @type {Subject<boolean>}
   */
  private data_changed: Subject<boolean> = new Subject<boolean>();
  $set_DataChangedEvent(): void {
    this.data_changed.next(true);
  }
  $get_DataChangedEvent(): Observable<any> {
    return this.data_changed.asObservable();
  }
  $unsbscribe_DataChangedEvent() {
    this.data_changed = new Subject<boolean>();
  }
  // items per page count observer--------------------------------------
  /**
   * ItemCount
   * @type {Subject<number>}
   */
  private itemsPerPage: Subject<number> = new Subject<number>();
  $set_ItemPerPageEvent(value):void {
    this.itemsPerPage.next(value);
  }
  $get_ItemPerPageEvent(): Observable<any> {
    return this.itemsPerPage.asObservable();
  }
  $unsbscribe_ItemPerPageEvent() {
    this.itemsPerPage = new Subject<number>();
  }
  // delete entry event observer----------------------------------------
  /**
   * Event String
   * 1. OPEN-MODAL
   * @type {Subject<string>}
   */
  private deleteEntry: Subject<string> = new Subject<string>();

  $set_ConfirmEntryEvent(event:string): void {
    this.deleteEntry.next(event);
  }
  $get_ConfirmEntryEvent(): Observable<any> {
    return this.deleteEntry.asObservable();
  }
  $unsbscribe_ConfirmEntryEvent() {
    this.deleteEntry = new Subject<string>();
  }
  
}
