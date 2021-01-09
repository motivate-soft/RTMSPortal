import { Component, Input } from '@angular/core';
import { ExportService } from 'src/app/shared/services/services-index';

@Component({
  selector: 'rtms-mds-dash-detail',
  templateUrl: './mds-dash-detail.component.html'
})
export class MdsDashDetailComponent {

  @Input() data: any;

  getCSSAlignment(table, index): string {
    if (table) {
      if (table.MdsDashTableData.lstMdsDashTableColumn[index] && table.MdsDashTableData.lstMdsDashTableColumn[index].Align === 'left') {
        return 'text-left';
      } else if (table.MdsDashTableData.lstMdsDashTableColumn[index] &&
        table.MdsDashTableData.lstMdsDashTableColumn[index].Align === 'right') {
        return 'text-right';
      } else {
        return 'text-center';
      }
    }
  }
}
