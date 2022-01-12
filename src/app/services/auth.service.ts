import { Injectable, NgZone } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
declare var Coco: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL: string = environment.COCO_API_URL;
  public accessTokenSubject = new BehaviorSubject("");
  accessToken = this.accessTokenSubject.asObservable();

  constructor(private router: Router, private spinnerService: SpinnerService, private _zone: NgZone) {
    this.baseURL = environment.COCO_API_URL;
  }

  public requestAuthorization(userId: any) {
    this.spinnerService.setSpinner(true);
    const url = this.baseURL + "/v1/auth/request-authorization";
    var obj = JSON.stringify({ 'userId': userId });
    return Coco.api(
      {
        "url": url,
        "method": "POST",
        "data": obj,
        "headers": {
          'Content-Type': 'application/json; charset=utf-8'
        },
        "responseType": "Text",
      });
  }

  public errorHandler(error: any) {
    if (error) {
      if (error == 'Error: Session expired') { //401 Unauthorized
        Coco.login();
      }
      // else if (error.status == 401) { //Unauthorized
      //   // this.router.navigate(['/', '401']);
      // }
      else if (error.status == 404) {
        this.router.navigate(['/', '404']);
      }
      else if (error.status == 500) {
        this.router.navigate(['/', '500']);
      }
    }
  }
}
