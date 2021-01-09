import { TemplateRef, ContentChild } from '@angular/core';
import { GridColumn } from './grid-column';
import { GridColumnTypes } from './grid-column-types';

export class TemplateColumn extends GridColumn {

    public ItemTemplate: TemplateRef<any>;

    public Data: any;

    get Type(): string {
        return GridColumnTypes.TemplateColumn;
    }
    constructor(init?: Partial<TemplateColumn>) {
        super();
        Object.assign(this, init);
    }

}
