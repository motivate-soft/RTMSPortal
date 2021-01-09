import { Injectable } from '@angular/core';
import { FilterStateService } from './filter-state.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable()
export class DataService {
  constructor(private filterStateService: FilterStateService, private http: HttpClient) { }

  postForItems<T>(url: string, body: any): Observable<T[]> {
    return this.http.post(url, body)
      .pipe(
        tap((response: any) => this.setFilter(response, res => res.Filter)),
        map((response: any) => response.Items)
      );
  }

  postForItem<T>(url: string, body: any): Observable<T> {
    return this.http.post(url, body)
      .pipe(
        tap((response: any) => this.setFilter(response, res => res.Item && res.Item.Filter ? res.Item.Filter : null)),
        map((response: any) => response.Item)
      );
  }

  postForResponse<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body)
      .pipe(
        tap((response: any) => response && this.setFilter(response, res => res.Filter))
      );
  }
  getForItem<T>(url: string): Observable<T> {
    return this.http.get(url)
      .pipe(
        tap((response: any) => this.setFilter(response, res => res.Item && res.Item.Filter ? res.Item.Filter : null)),
        map((response: any) => response.Item)
      );
  }
  getForItems<T>(url: string): Observable<T[]> {
    return this.http.get(url)
      .pipe(
        tap((response: any) => this.setFilter(response, res => res.Filter)),
        map((response: any) => response.Items)
      );
  }

  getForResponse<T>(url: string): Observable<T> {
    return this.http.get<T>(url)
      .pipe(
        tap((response: any) => this.setFilter(response, res => res.Filter))
      );
  }

  private setFilter(response: any, filterSelector: (res: any) => any): any {
    const filter = filterSelector(response);
    if (filter && !filter.IsDashboard) {
        const filterSettings = this.filterStateService.getFilter();
        if (filter.QMTypeIDs) {
            filter.QMTypeIDs = filterSettings.QMTypeIDs;
        }
      this.filterStateService.setFilter(filter);
    }
  }

  isResponseValid(response: any): any {
    if (response !== undefined && response.status !== 500) {
      return response;
    }
  }

  isResponseBodyValid(response: any): any {
    if (response !== undefined) {
      return response;
    }
  }
}
