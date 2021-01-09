import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { BaseComponent } from '../../components';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'rtms-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent extends BaseComponent implements OnInit {
  show = false;

  constructor(private loaderService: LoaderService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.loaderService.loaderState
      .pipe(
        map(noOfResponses => Boolean(noOfResponses)),
        distinctUntilChanged()
      )
      .subscribe(showLoader => {
        // To avoid Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
        setTimeout(() => {
          this.show = showLoader;
        });
      }
    ));
  }

}
