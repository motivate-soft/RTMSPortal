import { GridColumn } from './grid-column';
import { GridColumnTypes } from './grid-column-types';

export class LinkColumn extends GridColumn {
    Clicked: (data: any) => void;

    Icon?: string;

    ToolTip?: string;

    get Type(): string {
        return GridColumnTypes.LinkColumn;
    }
    constructor(init?: Partial<LinkColumn>) {
        super();
        Object.assign(this, init);
    }
}
