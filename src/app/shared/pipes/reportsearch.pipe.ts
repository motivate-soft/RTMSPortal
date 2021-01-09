import * as _ from 'lodash';
import { ReportModel } from 'src/app/shared/models/models-index';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reportSearchFilterPipe'
})
export class ReportSearchFilterPipe implements PipeTransform {

    transform(array: ReportModel[], searchText: string): any {
        if (searchText) {
            return _.filter(array, row => (row.ReportName.toLowerCase().includes(searchText.toLowerCase())));
        }
        return array;
    }
}
