import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rtms-resident-detail-care-transitions',
  templateUrl: './resident-detail-care-transitions.component.html',
  styleUrls: ['./resident-detail-care-transitions.component.scss']
})

export class ResidentDetailCareTransitionsComponent implements OnInit {

  constructor() { }

  @Input() seriesData: any[];

  ngOnInit() {

  }
}
