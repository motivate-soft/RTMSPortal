import { Injectable } from '@angular/core';
import { FiltersService } from '../../filter/store/services/filters.service';

@Injectable()
export class FilterStateService {

    constructor(private filterService: FiltersService
    ) {

    }

    setFilter(filter) {
      this.filterService.filterSettings.set(filter);
    }

    getFilter() {
        return  this.filterService.filterSettings.get();
    }

    clearFilterState() {
        this.filterService.filterSettings.clear();
    }
}
