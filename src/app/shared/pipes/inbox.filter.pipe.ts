
import { InboxModel } from 'src/app/shared/models/models-index';
import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';

@Pipe({
    name: 'inboxFilter'
})
export class InboxFilterPipe implements PipeTransform {

    transform(array: InboxModel[], subject: string): any {

        if (subject) {
            return filter( array, row => {
                return row.DisplayName.toLowerCase().includes(subject.toLowerCase());
              });
        }
        return array;
    }
}