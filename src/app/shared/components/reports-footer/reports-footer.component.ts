import { Component } from '@angular/core';

@Component({
  selector: 'rtms-reports-footer',
  templateUrl: './reports-footer.component.html'
})
export class ReportsFooterComponent {
  public currentTime = new Date();
}
