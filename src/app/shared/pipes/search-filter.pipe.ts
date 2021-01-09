import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
    transform(items: any, searchString: any): any {
        if (!searchString) { searchString = ''; }
        return items.filter(item => {
            for (const key in item) {
                if (('' + item[key]).toLowerCase().includes(searchString.toLowerCase())) {
                    return true;
                }
            }
            return false;
        });
    }
}