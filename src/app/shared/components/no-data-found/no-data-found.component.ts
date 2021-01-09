import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rtms-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.scss']
})
export class NoDataFoundComponent implements OnInit {

  @Input() noDataMessage: string;

  constructor() { }

  ngOnInit() {
    if (!this.noDataMessage) {
      this.noDataMessage = 'No data found.';
    }
  }

}
