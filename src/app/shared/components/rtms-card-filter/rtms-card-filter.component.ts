import { Component, OnInit, Input } from '@angular/core';
import { CardFilterStateService } from '../../services/card-filter-state.service';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';

@Component({
  selector: 'rtms-card-filter',
  templateUrl: './rtms-card-filter.component.html'
})
export class RtmsCardFilterComponent implements OnInit {

  @Input() reportId: number;
  @Input() cardFilterOptions: Array<any>;

  selectedOptionId: number;

  constructor(
    private utilizationMetricsService: UtilizationMetricsService,
    private cardFilterStateService: CardFilterStateService
  ) {
  }

  ngOnInit(): void {
    if (this.reportId > 0) {
      if (this.cardFilterOptions && this.cardFilterOptions.length > 0) {
        const foundSelectedItem = this.cardFilterStateService.getCardFilterForReport(this.reportId);
        if (foundSelectedItem && foundSelectedItem !== '') {
          this.cardFilterOptions.forEach(filter => {
            if (filter.Id === foundSelectedItem) {
              this.selectedOptionId = filter.Id;
            }
          });
        } else {
          const defaultSelectedIndex = this.cardFilterOptions.findIndex(o => o.IsDefault);
          if (defaultSelectedIndex != -1) {
            this.selectedOptionId = this.cardFilterOptions[defaultSelectedIndex].Id;
            this.cardFilterStateService.setCardFilter(this.reportId, this.selectedOptionId);
          } else {
            this.selectedOptionId = this.cardFilterOptions[0].Id;
          }
        }
      }
    }
  }

  public changeSelectedFilterOption(): void {
    this.utilizationMetricsService.recordCardFilter(this.reportId, this.selectedOptionId);
    this.cardFilterStateService.setCardFilter(this.reportId, this.selectedOptionId);
  }
}
