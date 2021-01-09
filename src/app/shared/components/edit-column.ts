import { LinkColumn } from './rtms-grid-v2/link-column';
import { GridColumnTypes } from './rtms-grid-v2/grid-column-types';

export class EditColumn extends LinkColumn {

  get Type(): string {
      return GridColumnTypes.EditColumn;
  }

   constructor(init?: Partial<EditColumn>) {
      super();
      Object.assign(this, init);
  }
}
