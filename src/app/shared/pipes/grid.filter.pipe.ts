
import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';
import { GridColumn } from '../components/rtms-grid-v2/grid-column';

@Pipe({
    name: 'gridFilter'
})
export class GridFilterPipe implements PipeTransform {

    transform(records: any[], columns: GridColumn[], search: string): any {

      if (!search || search === '') { return records; }

      const filteredArray = [];
      const searchValue = search.toLowerCase();

      records.forEach(record => {
        let hasFilterValue = false;
        columns.forEach(column => {
          if ((record[column.field] && record[column.field].toLowerCase().includes(searchValue)) || search === ' ') {
            hasFilterValue = true;
          }
        });
        if (hasFilterValue) {
          filteredArray.push(record);
        }
      });

      return filteredArray;
    }
}
