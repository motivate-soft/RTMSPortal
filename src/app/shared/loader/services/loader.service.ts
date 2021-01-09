import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private noOfRequests = 0;

    private loaderSubject = new BehaviorSubject<number>(this.noOfRequests);
    loaderState = this.loaderSubject.asObservable();

    show() {
        this.loaderSubject.next(++this.noOfRequests);
    }

    hide() {
        this.noOfRequests = Math.max(0, --this.noOfRequests);
        this.loaderSubject.next(this.noOfRequests);
    }
}
