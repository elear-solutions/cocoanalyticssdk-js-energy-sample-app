import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public spinnerSubject = new BehaviorSubject<boolean>(false);
  spinner = this.spinnerSubject.asObservable();
  private spinnerInstanceCounter: number = 0; // holds number of pending promises(requests)
  private spinnerWorkAround = true; // turn it to false to remove work around

  constructor() { }

  setSpinner(obj: boolean) {
    /**
     * this is a workaround as per current scenario. Currently if one service turns spinner off
     * spinner goes off for all pending promises. So this waits for set count to 0 to actually
     * trun off spinner.
     */
    if (this.spinnerWorkAround) {
      if (obj) {
        this.spinnerInstanceCounter++;
        this.spinnerSubject.next(obj);
      } else {
        this.spinnerInstanceCounter--;
        if (this.spinnerInstanceCounter <= 0) {
          this.spinnerSubject.next(obj);
        }
      }
    } else {
      this.spinnerSubject.next(obj);
    }
  }

  getSpinner(): Observable<any> {
    return this.spinnerSubject.asObservable();
  }
}
