import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rtms-resident-social-services',
  templateUrl: './resident-social-services.component.html',
  styleUrls: ['./resident-social-services.component.scss']
})
export class ResidentSocialServicesComponent implements OnInit {

  constructor() { }

  @Input() seriesData: any[];

  ngOnInit() {
  }

}
