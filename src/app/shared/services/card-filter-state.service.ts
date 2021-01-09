import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { CardFilter } from '../models/card-filter';
import { Injectable } from '@angular/core';

@Injectable()
export class CardFilterStateService {

    constructor(private filtersService: FiltersService) { }

    public setCardFilter(reportId: number, filterCardFilter: any): void {
        const lstCardFilters: Array<CardFilter> = [...this.filtersService.cardFilters.get()];
        lstCardFilters.forEach((filter, index) => {
            filter.isRecentUpdate = false;
            if (filter.reportId === reportId) {
                lstCardFilters.splice(index, 1);
            }

        });

         const newCardFilterItem: CardFilter = {
            reportId: reportId,
            cardFilter: filterCardFilter,
            isRecentUpdate: true
        };

        lstCardFilters.push(newCardFilterItem);
        this.filtersService.cardFilters.set(lstCardFilters);
    }


    public getCardFilterForReport(reportId: number): any {
        let returnValue = '';

        this.filtersService.cardFilters.get().forEach(filter => {
            if (filter.reportId === reportId) {
                returnValue = filter.cardFilter;
            }
        });
        return returnValue;
    }

    public clearCardFilters(): void {
        this.filtersService.cardFilters.clear();
    }
}
