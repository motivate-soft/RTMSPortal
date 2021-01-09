import { Injectable } from '@angular/core';
import { TourState } from '../states/tour-state';
import { Store } from '@ngrx/store';
import { getSingle , setValue,getStream} from 'src/app/store/services/storeServiceHelper';
import { Tour } from 'src/app/shared/models/tour';
import { setTourAction } from '../action';
import { getTour } from '../selectors/getTour';

@Injectable()
export class TourStateService{

    constructor(private store: Store<TourState>){

    }
    public getCurrentTour = getSingle(this.store, getTour);  
    public getCurrentTourStream = getStream(this.store, getTour);
    public setCurrentTour = (setTourInfo: Tour) => setValue(this.store, setTourAction, setTourInfo);
    public clearCurrentTour() {
        this.setCurrentTour(null);
    }
}