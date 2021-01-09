import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

export class BaseComponent implements OnDestroy {
  subscriptions: Array<Subscription> = [];

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
