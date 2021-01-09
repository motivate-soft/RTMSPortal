import * as _ from 'lodash';
import { InboxModel } from 'src/app/shared/models/models-index';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'inboxGroupFilter'
})
export class InboxGroupFilterPipe implements PipeTransform {

    transform(array: InboxModel[], groupId: number): any {
        if (groupId) {
            return _.filter(array, row => (row.InboxGroup===groupId));
        }
        return array;
    }
}