import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class PagingService {
    constructor() { }
    public pageSize = 50;

    public range(input: number, total: number): Array<number> {
        const ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (let i = input; i < total; i++) {
            if (i !== 0 && i !== total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }

    public lastPage(pageItemsArray: Array<any>): number {
        return pageItemsArray.length - 1;
    }

    public firstPage(): number {
        return 0;
    }

    public setPage(page: number, pageItemsArray: Array<any>): number {
        if (page > pageItemsArray.length - 1) {
            return pageItemsArray.length - 1;
        } else if (page < 0) {
            return 0;
        } else {
            return page;
        }
    }

    public pagination(data: Array<any>, pageSize: number = 0): Array<any> {
        return this.paged(data, pageSize || this.pageSize);
    }

    public paged(valLists: Array<any>, pageSize: number): Array<any> {
        const retVal = [];
        if (valLists) {
            for (let i = 0; i < valLists.length; i++) {
                if (i % pageSize === 0) {
                    retVal[Math.floor(i / pageSize)] = [valLists[i]];
                } else {
                    retVal[Math.floor(i / pageSize)].push(valLists[i]);
                }
            }
        }
        return retVal;
    }

    public sortData(data: Array<any>, sortingConfig: Array<{
        field: string,
        direction: 'asc' | 'desc'
    }>): Array<any> {
        let sortedList = _(data).map(val => { return { val }; });
        const sortArray = [];
        const sortDirArray = [];
        for (let sortByField of sortingConfig) {
            const hasValueProp = `__hasValue_${sortByField.field}`;
            const sortProp = `__sort_${sortByField.field}`;
            sortedList = sortedList.map(x => {
                x[hasValueProp] = x.val[sortByField.field] !== undefined
                    && x.val[sortByField.field] !== null && x.val[sortByField.field] !== '';
                const value = x.val[sortByField.field];
                x[sortProp] = _.isString(value) ? _.toLower(value) : value;
                return x;
            });

            sortArray.push(hasValueProp);
            sortArray.push(sortProp);
            sortDirArray.push('desc');
            sortDirArray.push(sortByField.direction);
        }

        return sortedList
            .orderBy(sortArray, sortDirArray)
            .map(x => x.val)
            .value();
    }
}
