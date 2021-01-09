import { GridColumnTypes } from './grid-column-types';

export class GridColumn {
    headerName?: string;
    field?: string;
    width?: string;
    textAlign: string;
    columnType: ColumnType;

    get Type(): string {
      return GridColumnTypes.GridColumn;
    }

    constructor(init?: Partial<GridColumn>) {
        Object.assign(this, init);
    }

}

enum ColumnType {
  Text = 1,
  LinkModal = 2,
  Link = 3
}
