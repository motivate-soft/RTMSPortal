import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rtms-resident-detail-card',
  templateUrl: './resident-detail-card.component.html',
  styleUrls: ['./resident-detail-card.component.scss']
})
export class ResidentDetailCardComponent implements OnInit {

  constructor() { }
  
  @Input() seriesData: any[];

  ngOnInit() {
  }
}
