import { EditColumn } from '../edit-column';
import { GridColumnTypes } from './grid-column-types';

export class PrimaryColumn extends EditColumn {
  get Type(): string {
      return GridColumnTypes.PrimaryColumn;
  }


  constructor(init?: Partial<PrimaryColumn>) {
      super();
      Object.assign(this, init);
  }
}
