import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PortalUIEvent } from '../../models/portal-ui-event';
import { filter } from 'rxjs/operators';

@Injectable()
export class UINotifierService {
    constructor() {

    }
    private events: Subject<PortalUIEvent> = new Subject<PortalUIEvent>();

    public getUIEvents(): Observable<PortalUIEvent> {
        return this.events.asObservable().pipe(filter(data => data !== null));
    }

    public publishEvents(value: PortalUIEvent) {
        this.events.next(value);
    }
}
